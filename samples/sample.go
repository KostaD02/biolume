// Package encryption ports steam-idler's EncryptionService: Steam credentials
// are sealed with AES-256-GCM and stored as "v1:iv:authTag:encrypted" in hex.
package encryption

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
)

const (
	ivLength          = 12
	encryptionVersion = "v1"
	payloadParts      = 4
)

var ErrMissingSecret = errors.New("CREDENTIALS_SECRET is not set, generate one with `pnpm g:secret` and add it to your .env")

type Service struct {
	gcm cipher.AEAD
}

func New(secret string) (*Service, error) {
	if secret == "" {
		return nil, ErrMissingSecret
	}

	key := sha256.Sum256([]byte(secret))
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCMWithNonceSize(block, ivLength)
	if err != nil {
		return nil, err
	}

	return &Service{gcm: gcm}, nil
}

func (s *Service) Encrypt(value string) (string, error) {
	if value == "" {
		return value, nil
	}

	iv := make([]byte, ivLength)
	if _, err := rand.Read(iv); err != nil {
		return "", fmt.Errorf("encrypt: %w", err)
	}

	// Seal appends the auth tag, but Node keeps it apart from the ciphertext
	sealed := s.gcm.Seal(nil, iv, []byte(value), nil)
	split := len(sealed) - s.gcm.Overhead()

	return strings.Join([]string{
		encryptionVersion,
		hex.EncodeToString(iv),
		hex.EncodeToString(sealed[split:]),
		hex.EncodeToString(sealed[:split]),
	}, ":"), nil
}

func (s *Service) Decrypt(value string) (string, error) {
	if value == "" || !strings.HasPrefix(value, encryptionVersion+":") {
		return value, nil
	}

	parts := strings.Split(value, ":")
	if len(parts) != payloadParts {
		return value, nil
	}

	decoded := make([][]byte, 0, payloadParts-1)
	for _, part := range parts[1:] {
		raw, err := hex.DecodeString(part)
		if err != nil {
			return "", fmt.Errorf("decrypt: %w", err)
		}
		decoded = append(decoded, raw)
	}

	iv, authTag, encrypted := decoded[0], decoded[1], decoded[2]
	if len(iv) != ivLength {
		return "", errors.New("decrypt: iv must be 12 bytes")
	}

	decrypted, err := s.gcm.Open(nil, iv, append(encrypted, authTag...), nil)
	if err != nil {
		return "", fmt.Errorf("decrypt: %w", err)
	}

	return string(decrypted), nil
}

func (s *Service) EncryptList(values []string) ([]string, error) {
	return mapAll(values, s.Encrypt)
}

func (s *Service) DecryptList(values []string) ([]string, error) {
	return mapAll(values, s.Decrypt)
}

func mapAll[T any](values []T, transform func(T) (T, error)) ([]T, error) {
	result := make([]T, len(values))
	for i, value := range values {
		var err error
		if result[i], err = transform(value); err != nil {
			return nil, err
		}
	}
	return result, nil
}
