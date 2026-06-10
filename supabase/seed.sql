insert into public.achievements
  (id, slug, title, description, sort_order, category, icon_path)
values
  ('basic-training', 'basic-training', 'Basic Training', 'Deal 100+ damage with a Starter Strike.', 1, 'combat', '/achievement-emblems/basic-training.png'),
  ('this-feels-personal', 'this-feels-personal', 'This Feels Personal', 'Apply 100 Vulnerable to a single enemy.', 2, 'combat', '/achievement-emblems/this-feels-personal.png'),
  ('terms-and-conditions-apply', 'terms-and-conditions-apply', 'Terms and Conditions Apply', 'Play a single card for 10+ energy.', 3, 'challenge', '/achievement-emblems/terms-and-conditions-apply.png'),
  ('walk-it-off', 'walk-it-off', 'Walk It Off', 'Survive after taking 100+ unblocked damage in a single turn.', 4, 'combat', '/achievement-emblems/walk-it-off.png'),
  ('intern-economy', 'intern-economy', 'Intern Economy', 'Win a run with a deck containing only 0-cost cards.', 5, 'economy', '/achievement-emblems/intern-economy.png'),
  ('embrace-the-darkness', 'embrace-the-darkness', 'Embrace the Darkness', 'Win a combat with 0 cards remaining in your deck.', 6, 'challenge', '/achievement-emblems/embrace-the-darkness.png'),
  ('shadow-government', 'shadow-government', 'Shadow Government', 'During combat, have every card in your deck contain the word Sly.', 7, 'deckbuilding', '/achievement-emblems/shadow-government.png'),
  ('the-kings-halo', 'the-kings-halo', 'The King''s Halo', 'Have 5 Sovereign Blades floating around you simultaneously.', 8, 'challenge', '/achievement-emblems/the-kings-halo.png'),
  ('mutually-assured-destruction', 'mutually-assured-destruction', 'Mutually Assured Destruction', 'Have more Doom on yourself than your max HP and win the fight.', 9, 'challenge', '/achievement-emblems/mutually-assured-destruction.png'),
  ('junkyard-detonation', 'junkyard-detonation', 'Junkyard Detonation', 'Play a Flak Cannon that hits 30 or more times.', 10, 'combat', '/achievement-emblems/junkyard-detonation.png'),
  ('prismatic-strike', 'prismatic-strike', 'Prismatic Strike', 'Have a card with the word Strike from every color in your deck.', 11, 'deckbuilding', '/achievement-emblems/prismatic-strike.png'),
  ('hostile-takeover', 'hostile-takeover', 'Hostile Takeover', 'Steal everything from the Fake Merchant.', 12, 'economy', '/achievement-emblems/hostile-takeover.png')
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order,
  category = excluded.category,
  icon_path = excluded.icon_path;
