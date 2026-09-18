//! Port of steam-idler's SteamCardsService badge parsing: one `GameWithCards`
//! per row of a Steam badges page, keeping the row with the most drops left.
use std::collections::HashMap;

const ICON_URL: &str = "https://cdn.cloudflare.steamstatic.com/steam/apps";

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GameWithCards {
    pub appid: u32,
    pub name: String,
    pub icon_url: String,
    /// Minutes, while the badge page shows hours
    pub playtime_forever: u32,
    pub cards_remaining: u32,
}

/// The number right after `needle`, like the appid in `/gamecards/570`.
fn number_after(block: &str, needle: &str) -> Option<u32> {
    let start = block.find(needle)? + needle.len();
    let digits: String = block[start..].chars().take_while(char::is_ascii_digit).collect();
    digits.parse().ok()
}

/// The number right before `needle`, like `1,024.5` in `1,024.5 hrs on record`.
fn number_before(block: &str, needle: &str) -> Option<f64> {
    let head = block[..block.find(needle)?].trim_end();
    let start = head
        .char_indices()
        .rev()
        .take_while(|&(_, c)| c.is_ascii_digit() || c == '.' || c == ',')
        .last()
        .map_or(head.len(), |(index, _)| index);
    head[start..].replace(',', "").parse().ok()
}

fn clean_text(value: &str) -> String {
    let mut text = String::with_capacity(value.len());
    let mut in_tag = false;

    for c in value.chars() {
        match c {
            '<' => in_tag = true,
            '>' => in_tag = false,
            _ if !in_tag => text.push(c),
            _ => {}
        }
    }

    let entities = [("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&quot;", "\""), ("&#39;", "'"), ("&nbsp;", " ")];
    let text = entities.into_iter().fold(text, |text, (entity, plain)| text.replace(entity, plain));
    text.split_whitespace().collect::<Vec<_>>().join(" ")
}

pub fn collect_badge_rows(html: &str, games: &mut HashMap<u32, GameWithCards>) {
    for block in html.split("class=\"badge_row").skip(1) {
        let Some(appid) = number_after(block, "/gamecards/") else {
            continue;
        };

        let name = block
            .split_once("badge_title\">")
            .map(|(_, rest)| {
                let end = ["<span", "</div"].into_iter().filter_map(|tag| rest.find(tag)).min();
                clean_text(&rest[..end.unwrap_or(rest.len())])
            })
            .unwrap_or_else(|| appid.to_string());

        let game = GameWithCards {
            appid,
            name,
            icon_url: format!("{ICON_URL}/{appid}/header.jpg"),
            playtime_forever: number_before(block, "hrs on record").map_or(0, |hours| (hours * 60.0).round() as u32),
            cards_remaining: number_before(block, "card drop").map_or(0, |drops| drops as u32),
        };

        let keep_existing = games
            .get(&appid)
            .is_some_and(|existing| existing.cards_remaining >= game.cards_remaining);

        if !keep_existing {
            games.insert(appid, game);
        }
    }
}

/// Most drops first, then by name, the way the dashboard lists them.
pub fn sorted(games: HashMap<u32, GameWithCards>) -> Vec<GameWithCards> {
    let mut games: Vec<_> = games.into_values().collect();
    games.sort_by(|a, b| b.cards_remaining.cmp(&a.cards_remaining).then_with(|| a.name.cmp(&b.name)));
    games
}

#[cfg(test)]
mod tests {
    use super::*;

    const ROW: &str = r#"<div class="badge_row is_link"><a href="/profiles/7656/gamecards/570/">
        <div class="badge_title">Dota&nbsp;2 <span>View details</span></div>
        <span class="progress_info_bold">3 card drops remaining</span> 12.5 hrs on record</a></div>"#;

    #[test]
    fn parses_a_badge_row() {
        let mut games = HashMap::new();
        collect_badge_rows(ROW, &mut games);

        let game = &games[&570];
        assert_eq!(game.name, "Dota 2");
        assert_eq!((game.cards_remaining, game.playtime_forever), (3, 750));
    }
}
