/**
 * 劇作家紹介（英語版）10本 — 海外の劇作家との比較
 *
 * 使い方:
 *   npx tsx scripts/add-articles-batch5.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  language: string;
}

const articles: Article[] = [
  {
    slug: 'guide-noda-hideki-japans-tom-stoppard',
    title: "Hideki Noda: Japan's Tom Stoppard — Wordplay, Speed, and Theatrical Revolution",
    description: "An introduction to Hideki Noda, Japan's most celebrated living playwright, whose dazzling wordplay and physical theater invite comparison with Tom Stoppard and Ariane Mnouchkine.",
    tags: ['Japanese Theater', 'Playwright Profile', 'Hideki Noda', 'NODA MAP', 'Guide', 'Comparative Theater'],
    language: 'en',
    content: `If Tom Stoppard is the master of English-language wordplay in theater, Hideki Noda is his Japanese counterpart — and then some. Noda doesn't just play with words; he makes the Japanese language itself become a character on stage, exploiting homophones, double meanings, and sonic patterns in ways that are virtually untranslatable.

## Who Is Hideki Noda?

Hideki Noda (born 1955) is a playwright, director, and actor who has dominated Japanese theater for over four decades. He is the founder of NODA MAP and currently serves as Artistic Director of the Tokyo Metropolitan Theatre.

**Key facts:**
- Kishida Kunio Drama Award winner (1983)
- Founded the legendary company Yume no Yuminsha (Dream Wanderers, 1976–1992)
- Studied at the Royal Court Theatre in London (1993–94)
- Purple Ribbon Medal recipient (2009)
- Tokyo University law graduate who chose theater over a legal career

## The Stoppard Comparison

Both Noda and Tom Stoppard are intellectual playwrights who revel in linguistic virtuosity. But the comparison illuminates important differences.

### What They Share

- **Wordplay as structure**: Both use puns and linguistic games not as decoration but as the structural backbone of their plays
- **Multiple layers of meaning**: Their scripts reward repeated viewing/reading
- **History as raw material**: Both mine historical events for theatrical meaning — Stoppard with *Travesties* and *Arcadia*, Noda with works about Nagasaki, Manchuria, and wartime Japan
- **High entertainment value**: Despite intellectual depth, both are fundamentally entertaining

### Where They Differ

- **Physicality**: Noda's theater is intensely physical. Actors sprint, leap, and tumble. Stoppard's wit is primarily verbal; Noda's is both verbal and corporeal
- **Language mechanics**: Stoppard exploits English syntax and semantics. Noda exploits something unique to Japanese — the fact that a single sound can map to dozens of different kanji (Chinese characters), creating cascading double meanings
- **Scale of transformation**: A Noda production can shift from comedy to tragedy to mythological spectacle in seconds, more like Ariane Mnouchkine's Théâtre du Soleil than a typical British intellectual drama

## Essential Works

### "Half-God" (半神, 1986)

Based on a manga by Moto Hagio about conjoined twin sisters — one beautiful but intellectually disabled, the other brilliant but physically dependent. When they are surgically separated, the beautiful sister dies. A devastating 80-minute piece about love, dependency, and sacrifice.

**Western parallel**: Its exploration of bodily identity resonates with themes in Sarah Kane's *Crave* and *4.48 Psychosis*, though Noda's approach is more mythological.

### "Fake Musashi" (贋作・桜の森の満開の下, 1989)

An adaptation of Ango Sakaguchi's story about a bandit, a beautiful woman, and cherry blossoms. Noda transforms it into a meditation on beauty, violence, and artistic obsession.

### "The Bee" (2006)

Perhaps Noda's most internationally accessible work. Based on a Yasutaka Tsutsui story, it was performed in both English and Japanese versions, with Kathryn Hunter starring in London. A man's family is held hostage; he retaliates by holding the hostage-taker's family. Violence escalates symmetrically and absurdly.

**Western parallel**: The premise recalls Edward Albee's *The Goat* in its exploration of how ordinary people become capable of extreme acts.

### "Egg" (エッグ, 2012)

A sport called "egg" becomes a metaphor for Japan's wartime biological weapons program (Unit 731). Past and present collide in Noda's characteristically dizzying fashion.

**Western parallel**: Like Peter Weiss's *The Investigation*, it confronts historical atrocity — but through metaphor and physical theater rather than documentary.

## Why International Audiences Should Know Noda

Noda represents something that doesn't quite exist in Western theater: a playwright-director-performer who combines the verbal brilliance of Stoppard, the physical theater of Jacques Lecoq's tradition, the historical consciousness of Heiner Müller, and a pop-culture energy entirely his own.

His works are challenging to translate (the wordplay is language-specific), but productions like *The Bee* and international collaborations have brought his work to London, New York, and festivals worldwide.

If you get a chance to see a NODA MAP production in Tokyo — even without perfect Japanese — the sheer theatrical energy, physical precision, and visual storytelling make the experience unforgettable.

## Reading Noda

- *The Bee* is available in English translation
- Several academic studies of Noda's work exist in English, including chapters in *A History of Japanese Theatre* (Cambridge University Press)
- Video recordings of some productions are available at the Tokyo Metropolitan Theatre archives`,
  },

  {
    slug: 'guide-mitani-koki-japans-neil-simon',
    title: "Koki Mitani: Japan's Neil Simon — The Art of the Well-Made Comedy",
    description: "An introduction to Koki Mitani, Japan's most successful comedy writer, whose mastery of situation comedy and ensemble plotting invites comparison with Neil Simon and Alan Ayckbourn.",
    tags: ['Japanese Theater', 'Playwright Profile', 'Koki Mitani', 'Comedy', 'Guide', 'Comparative Theater'],
    language: 'en',
    content: `If you love the intricate plotting of Alan Ayckbourn, the character-driven comedy of Neil Simon, or the backstage farces of Michael Frayn, you need to know Koki Mitani — Japan's greatest living comedy writer and one of its most prolific dramatists.

## Who Is Koki Mitani?

Koki Mitani (born 1961) is a playwright, screenwriter, and film director who has achieved the rare feat of being both critically acclaimed and enormously popular. He writes for stage, television, and film with equal facility.

**Key facts:**
- Two-time Kishida Kunio Drama Award winner (1995, 1997)
- Wrote three NHK Taiga dramas (year-long historical series): *Shinsengumi!* (2004), *Sanada Maru* (2016), *The 13 Lords of the Shogun* (2022)
- Created the iconic TV series *Furuhata Ninzaburo* (Japan's answer to *Columbo*)
- Founded Tokyo Sunshine Boys theater company (1983–1994; reunited 2024)

## The Neil Simon Comparison

### What They Share

- **Prolific output**: Both are writing machines across multiple media
- **Character-driven humor**: Comedy emerges from recognizable human behavior, not gags
- **Box office dominance**: Both are (or were) the most commercially successful playwrights in their respective countries
- **Audience accessibility**: Their work is entertaining on first viewing and rewarding on deeper analysis

### The Ayckbourn Connection

Mitani may actually be closer to Alan Ayckbourn than to Simon:

- **Structural ingenuity**: Mitani's plots are clockwork mechanisms where every setup pays off. Like Ayckbourn's *The Norman Conquests* (three plays showing the same weekend from different perspectives), Mitani loves structural experiments
- **Ensemble comedy**: Rather than star vehicles, Mitani writes for ensembles of 8–15 characters, each with their own arc
- **Comedy with darkness**: Beneath the laughter, there's often melancholy or moral complexity

### Where Mitani Is Unique

- **Historical comedy**: Mitani fearlessly applies comedy to serious historical subjects — the Shinsengumi (samurai police), the Sengoku period wars, and the founding of the Kamakura shogunate
- **Cross-media fluency**: He moves between stage, TV, and film more seamlessly than any Western equivalent

## Essential Works

### "12 Gentle Japanese" (12人の優しい日本人, 1990)

Mitani's breakout play. A reimagining of *12 Angry Men* — but set in a Japanese jury trial where the jurors start by unanimously voting "not guilty" and then gradually talk themselves into "guilty." A brilliant inversion that also serves as cultural commentary on Japanese consensus culture.

**Western parallel**: Sidney Lumet's *12 Angry Men*, obviously, but Mitani's version is both an homage and a critique.

### "The University of Laughs" (笑の大学, 1996)

Set in 1940s Japan, a government censor must review a comedy script. Through five days of revisions, censor and playwright develop an unlikely creative partnership — and the script gets funnier with each round of censorship. A two-person play that works as comedy, historical drama, and a meditation on the nature of humor itself.

**Western parallel**: Imagine Tom Stoppard's *The Real Inspector Hound* crossed with the censorship themes of Václav Havel's *Largo Desolato*.

### "Orchestra Pit!" (オケピ!, 2000)

A musical set entirely in an orchestra pit during a show. The musicians navigate personal dramas while trying to play their instruments. Won the Kishida Prize.

**Western parallel**: Michael Frayn's *Noises Off* (backstage chaos comedy), but with music and a gentler touch.

### "A Film About the Nation" (国民の映画, 2011)

Joseph Goebbels hosts a dinner party for Germany's greatest filmmakers. A comedy about propaganda, art, and moral compromise that manages to be both hilarious and chilling.

**Western parallel**: The tonal balance recalls Roberto Benigni's *Life Is Beautiful* — comedy as a lens for examining fascism.

## Why International Audiences Should Know Mitani

Mitani proves that sophisticated comedy is a universal language. His structural innovations — the inverted jury play, the comedy that improves through censorship, the musical in a pit — are theatrical ideas that transcend cultural boundaries.

For anyone who believes that comedy is "lesser" theater, Mitani's work is the definitive rebuttal. His plays are as carefully constructed as any tragedy, and they reveal truths about human nature that only laughter can unlock.

## Reading & Watching Mitani

- *The University of Laughs* has been adapted into a film (2004) available with English subtitles
- *12 Gentle Japanese* was filmed in 1991
- His NHK Taiga dramas are available with English subtitles on some streaming platforms`,
  },

  {
    slug: 'guide-tsuka-kohei-japans-david-mamet',
    title: "Tsuka Kohei: Japan's David Mamet — Raw Energy, Rhythmic Dialogue, and Theatrical Heat",
    description: "An introduction to Tsuka Kohei, the volcanic Japanese playwright whose intense dialogue and actor-driven theater invite comparison with David Mamet and Sam Shepard.",
    tags: ['Japanese Theater', 'Playwright Profile', 'Tsuka Kohei', 'Guide', 'Comparative Theater'],
    language: 'en',
    content: `If David Mamet's plays hit you like a fist — rapid-fire dialogue, masculine energy, and an almost musical sense of rhythm — then Tsuka Kohei's theater will feel like a typhoon. Tsuka (1948–2010) was Japanese theater's most volcanic force: a playwright whose work was performed at a fever pitch, with actors screaming, weeping, and collapsing in exhaustion.

## Who Was Tsuka Kohei?

Born Kim Bong-woong (金峰雄) to Korean parents in Fukuoka, Tsuka Kohei was a Zainichi Korean (ethnic Korean born in Japan) who channeled experiences of discrimination and cultural displacement into explosively entertaining theater.

**Key facts:**
- Kishida Kunio Drama Award (1974) for *The Atami Murder Case*
- Naoki Prize (1982) for the novel *Kamata March* — one of the few playwrights to win both Japan's top drama and fiction awards
- Created an acting method based on improvisation and "oral dictation" (口立て)
- Trained numerous actors who became major film and TV stars

## The Mamet Comparison

### What They Share

- **Dialogue as music**: Both write dialogue with an almost percussive rhythm. Tsuka's actors deliver lines at breakneck speed, building to emotional crescendos
- **Masculine energy**: Their stages crackle with testosterone, confrontation, and power dynamics
- **Working-class settings**: Both gravitate toward characters on society's margins — small-time crooks, struggling actors, people fighting for dignity
- **Actor-centric theater**: Both create work that demands extraordinary performances

### The Sam Shepard Connection

Tsuka also shares DNA with Sam Shepard:
- **American/Japanese identity crisis**: Where Shepard explored the dark side of the American Dream, Tsuka explored what it meant to be Korean in Japan — an outsider in the only country he knew
- **Family as battlefield**: Both used family dynamics as a crucible for larger cultural conflicts
- **Mythologizing the margins**: Both transformed marginal communities (Shepard's rural America, Tsuka's backstage world) into epic theatrical landscapes

### Where Tsuka Is Unique

- **Oral creation**: Tsuka didn't write finished scripts. He composed in the rehearsal room, watching actors improvise, then "dictating" dialogue that fit their bodies and voices. Each production was unique
- **Comedy-tragedy whiplash**: Tsuka could make an audience laugh hysterically and sob within the same minute. This emotional velocity has no Western equivalent
- **Korean-Japanese identity**: His work carries the weight of colonial history and ethnic discrimination in ways specific to the Zainichi experience

## Essential Works

### "The Atami Murder Case" (熱海殺人事件, 1973)

A detective interrogates a murder suspect, but the investigation becomes a theatrical game in which truth, fiction, and performance blur completely. Tsuka rewrote this play dozens of times over his career — each version reflecting his evolving concerns.

**Western parallel**: Harold Pinter's interrogation plays (*One for the Road*, *Mountain Language*), but with comedy and theatrical self-awareness that Pinter would never allow.

### "Kamata March" (蒲田行進曲, 1980)

Life among bit-part actors in a film studio. A love triangle between a star actor, a struggling extra, and a woman becomes a meditation on sacrifice, loyalty, and the cruelty of the entertainment industry. Won the Naoki Prize as a novel; became a hit film directed by Kinji Fukasaku (1982).

**Western parallel**: The backstage world recalls *All About Eve* or *A Chorus Line*, but with Tsuka's signature rawness.

### "Flying Dragon Legend" (飛龍伝, 1976)

Set during Japan's 1960s student protest movement, this play captures the idealism, violence, and eventual disillusionment of an entire generation.

**Western parallel**: The political passion of Dario Fo's *Accidental Death of an Anarchist*, combined with the generational portrait of a play like *Hair*.

## The Tsuka Legacy

Tsuka died of lung cancer in 2010 at age 62, reportedly revising scripts until his final days. His influence is enormous: the actors he trained populate Japanese film and television, and his rehearsal methodology influenced an entire generation of directors.

For international audiences, Tsuka represents something rare — theater as pure physical and emotional energy, where the boundary between performer and character dissolves completely.

## Experiencing Tsuka

Tsuka's work is difficult to translate (much of its power lies in the delivery rather than the text), but:
- The film *Kamata March* (1982) is available with English subtitles and captures some of Tsuka's energy
- Academic studies of Zainichi Korean theater often feature extensive analysis of Tsuka's work`,
  },

  {
    slug: 'guide-betsuyaku-minoru-japans-beckett',
    title: "Minoru Betsuyaku: Japan's Beckett — Absurdity in the Everyday",
    description: "An introduction to Minoru Betsuyaku, the father of Japanese absurdist theater, whose quiet, unsettling plays invite direct comparison with Samuel Beckett and Eugène Ionesco.",
    tags: ['Japanese Theater', 'Playwright Profile', 'Minoru Betsuyaku', 'Absurdist Theater', 'Guide', 'Comparative Theater'],
    language: 'en',
    content: `Samuel Beckett's *Waiting for Godot* changed Minoru Betsuyaku's life. After encountering Beckett's work as a young man, Betsuyaku (1937–2020) devoted his career to creating a distinctly Japanese form of absurdist theater — one rooted not in existential philosophy but in the quiet strangeness of everyday Japanese life.

## Who Was Minoru Betsuyaku?

Born in Manchuria (then under Japanese control) in 1937, Betsuyaku was repatriated to Japan after World War II. This experience of displacement — of having one's world erased overnight — haunted his entire body of work.

**Key facts:**
- Kishida Kunio Drama Award (1968) for *The Match Girl* and *A Landscape with Red Bird*
- Wrote over 200 plays across a 50-year career
- Also acclaimed as an essayist with a deadpan wit
- Died in 2020 at age 82

## The Beckett Comparison

The comparison is inevitable — Betsuyaku himself acknowledged Beckett as his starting point. But what makes Betsuyaku fascinating is how he transformed Beckett's European absurdism into something entirely Japanese.

### What They Share

- **Nameless characters**: "Man A," "Woman," "The Traveler" — both playwrights strip characters of individual identity
- **Repetitive structures**: Dialogue loops back on itself, conversations go nowhere, time seems circular
- **Sparse staging**: A road, a bench, a telephone pole — minimal settings that could be anywhere (or nowhere)
- **The comedy of futility**: Both find dark humor in humanity's inability to communicate or connect

### Where They Differ

- **Source of absurdity**: Beckett's absurdity is metaphysical — the universe is meaningless. Betsuyaku's absurdity is *social* — the polite, rule-following surface of Japanese daily life conceals something deeply strange
- **Tone**: Beckett tends toward cosmic bleakness punctuated by humor. Betsuyaku is gentler, more domestic — his absurdity creeps in through the cracks of ordinary conversation
- **Specificity**: Beckett's landscapes are abstract. Betsuyaku's are recognizably Japanese — telephone poles, apartment buildings, train stations — made uncanny through slight distortions

### The Ionesco Connection

Betsuyaku also shares ground with Eugène Ionesco:
- **Language malfunction**: Like Ionesco's *The Bald Soprano*, Betsuyaku's plays show language breaking down — polite phrases becoming meaningless, conversations sliding into absurdity
- **The sinister ordinary**: Both find horror in the mundane

## Essential Works

### "The Match Girl" (マッチ売りの少女, 1966)

Inspired by Hans Christian Andersen's fairy tale, but transformed into something deeply unsettling. Adults gather around the body of a match-selling girl, but their conversation reveals indifference, self-interest, and a chilling inability to acknowledge what has happened.

**Western parallel**: The social indifference recalls Ionesco's *Rhinoceros* — the community's failure to respond to an obvious crisis.

### "The Elephant" (象, 1962)

An early work about a man suffering from radiation sickness after the atomic bombing. The play's restraint — its refusal to be melodramatic about an inherently horrifying subject — is its devastating power.

**Western parallel**: The quiet treatment of catastrophe recalls Beckett's approach to suffering in *Endgame*.

### "Moving" (移動, 1973)

A couple is moving house. Or are they? The ordinary act of relocation becomes increasingly strange as the boundaries between the old home and the new, between moving and staying, dissolve.

## Why International Audiences Should Know Betsuyaku

Betsuyaku answers a fascinating question: what happens when absurdist theater — born from European existentialism — is transplanted into a culture with entirely different assumptions about selfhood, community, and silence?

The result is theater that is immediately recognizable to anyone who knows Beckett or Ionesco, yet feels fundamentally different. Betsuyaku's absurdity isn't about the void at the center of existence — it's about the void at the center of a perfectly polite conversation.

For Western readers interested in how avant-garde theatrical traditions cross cultural boundaries, Betsuyaku is essential reading.

## Reading Betsuyaku

- *The Match Girl* has been translated into English and included in several anthologies of Japanese drama
- *The Elephant* is available in English translation
- Academic studies of Japanese absurdist theater frequently feature Betsuyaku's work`,
  },

  {
    slug: 'guide-hirata-oriza-japans-chekhov',
    title: "Oriza Hirata: Japan's Chekhov — The Revolution of Quiet Theater",
    description: "An introduction to Oriza Hirata, who revolutionized Japanese theater with 'contemporary colloquial theater,' a method that invites comparison with Chekhov, Robert Altman, and Mike Leigh.",
    tags: ['Japanese Theater', 'Playwright Profile', 'Oriza Hirata', 'Contemporary Colloquial Theater', 'Guide', 'Comparative Theater'],
    language: 'en',
    content: `Imagine a play where nothing seems to happen. People chat about lunch plans, complain about the weather, make awkward small talk. No dramatic confrontations, no monologues, no climactic revelations. And yet, by the end, you feel you've witnessed something profound about human connection and isolation.

This is the theater of Oriza Hirata — and if that description reminds you of Chekhov, you're not wrong.

## Who Is Oriza Hirata?

Oriza Hirata (born 1962) is arguably the most influential Japanese theater-maker of the past three decades. He didn't just write plays — he created an entire theory of theater called *gendai kōgo engeki* (contemporary colloquial theater) that changed how Japanese actors speak, move, and relate to each other on stage.

**Key facts:**
- Kishida Kunio Drama Award (1995) for *Tokyo Notes*
- Founder of theater company Seinendan (Youth Group, 1982–)
- President of Professional University of International Arts and Culture (Toyooka, Hyogo Prefecture)
- Pioneer of "robot theater" with Osaka University
- Author of *Engeki Nyūmon* (Introduction to Theater, 1998), one of Japan's best-selling books on theater

## The Chekhov Comparison

### What They Share

- **The drama of the ordinary**: Both write plays where "nothing happens" on the surface, but everything happens beneath it
- **Ensemble over protagonist**: No single hero — instead, a community of characters whose overlapping stories create meaning
- **Simultaneous conversation**: Chekhov pioneered characters talking past each other. Hirata takes this further — in his productions, multiple conversations literally happen simultaneously on stage
- **Melancholy of connection**: Both portray people who desperately want to connect but can't quite manage it
- **Provincial settings**: Chekhov's country estates; Hirata's suburban living rooms and waiting areas

### The Robert Altman Connection

Hirata's technique of simultaneous dialogue — where 2–3 conversations happen at once and the audience chooses what to listen to — is remarkably similar to Robert Altman's film technique in *Nashville* or *Short Cuts*. Both create a sense of life happening in real time, without the artificial focus of conventional narrative.

### The Mike Leigh Connection

Like Mike Leigh, Hirata is obsessed with how people actually talk — the "umms," the interruptions, the sentences that trail off. He transcribes real conversation patterns with forensic precision.

### Where Hirata Is Unique

- **Theoretical framework**: Unlike most playwrights, Hirata has published a comprehensive theory of his method. His distinction between "conversation" (共有されたコンテクスト内のやり取り) and "dialogue" (異なるコンテクスト間のやり取り) has influenced Japanese education and communication studies
- **Robot theater**: Hirata has created plays featuring actual robots (developed at Osaka University) performing alongside human actors, exploring what "humanness" means in performance
- **Educational impact**: His methods are now taught in Japanese elementary schools as communication exercises

## Essential Works

### "Tokyo Notes" (東京ノート, 1994)

Set in the lobby of an art museum in a near-future Tokyo where a war is happening in Europe. Visitors come and go, discussing art, family, relationships — but never directly addressing the war that hovers at the edges of every conversation. Winner of the Kishida Prize and performed in over 20 countries.

**Western parallel**: The indirect engagement with political crisis recalls Chekhov's *Three Sisters*, where characters discuss everything except the life they're actually losing.

### "Seoul Citizens" Trilogy (ソウル市民三部作, 1989–)

Set in Seoul under Japanese colonial rule, these plays portray ordinary Japanese colonizers — not as villains but as banal, well-meaning people who fail to see the violence of the system they participate in. A profound examination of complicity.

**Western parallel**: Hannah Arendt's "banality of evil" concept, dramatized. The approach recalls Rainer Werner Fassbinder's examination of everyday fascism in German theater and film.

### "Sayonara" (Robot Theater, 2010)

A dying woman and an android recite poetry to each other. Created with robotics professor Hiroshi Ishiguro, this work asks: can a machine provide genuine comfort? The audience's emotional response — many report crying — suggests unsettling answers.

## Why International Audiences Should Know Hirata

Hirata's work is a masterclass in theatrical minimalism. He proves that you don't need spectacle, conflict, or even plot to create compelling theater — you just need truthful human behavior observed with extraordinary precision.

For Western theater-makers influenced by Chekhov's naturalism, Hirata represents the logical next step: what happens when you strip away even the dramatic structure that Chekhov retained?

## Reading & Experiencing Hirata

- *Tokyo Notes* is available in English translation and has been performed internationally
- *Engeki Nyūmon* (Introduction to Theater) has been partially translated and is essential reading for theater practitioners
- Seinendan occasionally tours internationally — check their schedule`,
  },

  {
    slug: 'guide-kokami-shoji-theater-and-society',
    title: "Shoji Kokami: Japan's Social Conscience — Theater Against Conformity",
    description: "An introduction to Shoji Kokami, the Japanese playwright who uses theater to challenge social conformity, inviting comparison with Arthur Miller and Athol Fugard.",
    tags: ['Japanese Theater', 'Playwright Profile', 'Shoji Kokami', 'Guide', 'Comparative Theater'],
    language: 'en',
    content: `Every theater culture needs a voice that asks uncomfortable questions about society. In America, that voice was Arthur Miller. In South Africa, Athol Fugard. In Japan, since the 1980s, that voice has been Shoji Kokami.

## Who Is Shoji Kokami?

Shoji Kokami (born 1958) is a playwright, director, and writer who rose to fame leading the theater company Daisan Butai (Third Stage) during the 1980s small-theater boom. Today he is equally known as an essayist and advice columnist, addressing the pressures of conformity in Japanese society.

**Key facts:**
- Kishida Kunio Drama Award (1992) for *Snufkin's Letter*
- Founded Daisan Butai (Third Stage, 1981–2012)
- Professor at Toho Gakuen College of Drama and Music
- Best-selling author of books on social conformity, including *Don't Follow the Air You Read*

## The Arthur Miller Comparison

### What They Share

- **Individual vs. society**: Both playwrights center their work on the tension between personal integrity and social pressure. Miller's Willy Loman is crushed by the American Dream; Kokami's characters are crushed by Japan's culture of *kūki wo yomu* (reading the air — sensing and following unspoken social expectations)
- **Accessible seriousness**: Both wrap serious themes in accessible, emotionally engaging drama
- **Public intellectual role**: Beyond playwriting, both became prominent social commentators — Miller through essays and congressional testimony, Kokami through books and newspaper columns

### Where Kokami Differs

- **Pop sensibility**: Kokami's theater is more stylistically adventurous than Miller's naturalism. His 1980s work was consciously "pop" — fast-paced, youth-oriented, with rock music and dynamic staging
- **The Moomin connection**: Kokami's Kishida Prize-winning play *Snufkin's Letter* uses Tove Jansson's character Snufkin (from the Moomin stories) as a symbol of freedom from social obligation — a playful approach Miller would never take
- **Evolving medium**: Kokami has moved from theater to books to newspaper advice columns, always pursuing the same theme through whatever medium reaches people

## Essential Works

### "Snufkin's Letter" (スナフキンの手紙, 1991)

Using the figure of Snufkin — the wandering, free-spirited character from Tove Jansson's Moomin stories — Kokami explores what true freedom means in a society that demands conformity. The play asks: is it possible to live as Snufkin does, unburdened by social obligations, in modern Japan?

### "Angels Close Their Eyes" (天使は瞳を閉じて, 1988)

A play about war, memory, and the stories we tell ourselves to justify violence. Angels observe human conflict but cannot intervene.

**Western parallel**: Tony Kushner's *Angels in America* also uses angels as a theatrical device to examine society, though the contexts (AIDS crisis vs. Japanese war memory) are very different.

### "Halcyon Days" (ハルシオン・デイズ, 2001)

Set in a psychiatric ward, patients and staff navigate the boundary between sanity and insanity — which turns out to be far more porous than society pretends.

**Western parallel**: The institutional setting and its examination of "normalcy" recalls Dale Wasserman's *One Flew Over the Cuckoo's Nest* and Peter Weiss's *Marat/Sade*.

## Beyond Theater: Kokami as Social Thinker

Kokami's most widely read work may not be a play at all. His book *"Kūki" wo Yondemo Shitagawanai* (Don't Follow the "Air" You Read) has become essential reading for young Japanese people questioning social conformity. His advice column in *AERA dot.* regularly goes viral for its compassionate, clear-eyed responses to readers struggling with bullying, workplace pressure, and family conflict.

In this sense, Kokami has achieved something rare — using the empathy developed through decades of theatrical practice to address real people's real problems.

## Why International Audiences Should Know Kokami

Kokami illuminates one of the most important dynamics in Japanese society: the tension between *wa* (harmony/conformity) and individual expression. For anyone trying to understand modern Japan beyond stereotypes, Kokami's work — both theatrical and literary — is invaluable.`,
  },

  {
    slug: 'guide-kudokan-japans-tarantino-of-stage',
    title: "Kankuro Kudo (Kudokan): Japan's Tarantino of the Stage — Pop Culture Alchemy",
    description: "An introduction to Kankuro Kudo (Kudokan), the screenwriter-playwright who blends rakugo, hip-hop, and Showa nostalgia, inviting comparison with Quentin Tarantino and Aaron Sorkin.",
    tags: ['Japanese Theater', 'Playwright Profile', 'Kankuro Kudo', 'Otona Keikaku', 'Guide', 'Comparative Theater'],
    language: 'en',
    content: `Imagine a writer who can seamlessly blend traditional Japanese storytelling, hip-hop culture, professional wrestling references, and genuine emotional depth into a single script — and make it all feel organic. That's Kankuro Kudo, known universally in Japan as "Kudokan."

## Who Is Kudokan?

Kankuro Kudo (born 1970) is a screenwriter, playwright, and actor who is a member of the theater company Otona Keikaku (Adult Planning). He is one of the most recognized names in Japanese entertainment, having written some of the country's most beloved TV dramas.

**Key facts:**
- Kishida Kunio Drama Award (2001 for *Donju*, 2024 for *Mou Gaman Dekinai*)
- Member of Otona Keikaku (led by Suzuki Matsuo)
- Created TV phenomenon *Amachan* (NHK, 2013) — watched by 20+ million viewers daily
- Wrote NHK Taiga drama *Idaten* (2019)
- Also wrote *Ikebukuro West Gate Park*, *Tiger & Dragon*, *Fudekiteki ni mo Hodo ga Aru!*

## The Tarantino Comparison

### What They Share

- **Pop culture encyclopedia**: Both are omnivorous consumers of pop culture who remix it into something new. Tarantino draws from kung fu films, blaxploitation, and spaghetti westerns. Kudokan draws from rakugo (traditional comic storytelling), professional wrestling, Showa-era (1926–1989) TV shows, and J-pop
- **Genre-blending**: Neither respects genre boundaries. A Kudokan drama can shift from comedy to crime thriller to musical number within a single episode
- **Dialogue-driven**: Both write distinctive, quotable dialogue that characters deliver with relish
- **Deep affection for their references**: Neither is ironic about the culture they reference — the love is genuine

### The Aaron Sorkin Connection

Kudokan's rapid-fire, witty dialogue and ability to make workplace dynamics compelling also invites Sorkin comparisons:
- **Verbal velocity**: Characters in Kudokan's work talk fast and smart
- **Ensemble dynamics**: Like Sorkin's newsrooms and White Houses, Kudokan excels at depicting groups of people working together

### Where Kudokan Is Unique

- **Rakugo integration**: Kudokan frequently incorporates rakugo — a 400-year-old Japanese art of solo comic storytelling — into modern narratives. *Tiger & Dragon* is literally about a yakuza member learning rakugo
- **Two registers**: His TV work is accessible and heartwarming; his stage work (with Otona Keikaku) is anarchic, profane, and boundary-pushing. He maintains both registers simultaneously
- **Showa nostalgia as critique**: Kudokan often uses 1960s–80s Japan as a mirror for contemporary issues, as in *Fudekiteki ni mo Hodo ga Aru!* (2024), where a 1986 PE teacher time-travels to 2024 and confronts modern political correctness

## Essential Works

### "Donju" (鈍獣, 2001)

A man returns to his rural hometown, triggering a cascade of violence and revelation. Three locals — a writer, a bar owner, and a teacher — must confront what they did to him years ago. Dark comedy meets small-town noir.

**Western parallel**: The small-town darkness recalls Martin McDonagh's *The Beauty Queen of Leenane* or *The Pillowman*.

### "Tiger & Dragon" (タイガー&ドラゴン, 2005)

A yakuza member becomes obsessed with rakugo and apprentices himself to a storyteller. Each episode parallels a classic rakugo story with the characters' modern lives. Perhaps Kudokan's masterpiece — a work that simultaneously preserves and reinvents a traditional art form.

**Western parallel**: The structure — classic stories mirroring modern lives — recalls the technique of Michael Cunningham's *The Hours* or the Coen Brothers' *O Brother, Where Art Thou?*

### "Mou Gaman Dekinai" (もうがまんできない, 2023)

A workplace comedy about power harassment and compliance culture. Won the Kishida Prize for its razor-sharp examination of how modern Japanese society navigates (or fails to navigate) changing social norms.

## Why International Audiences Should Know Kudokan

Kudokan represents a type of writer that barely exists in Western theater: someone who is simultaneously a major television figure and a serious stage playwright. His work demonstrates that pop culture literacy and theatrical depth are not opposites — they can fuel each other.

For anyone interested in contemporary Japanese culture, Kudokan's work is a portal into how Japan processes its own traditions, contradictions, and generational tensions.`,
  },

  {
    slug: 'guide-matsuo-suzuki-japans-mcdonagh',
    title: "Suzuki Matsuo: Japan's Martin McDonagh — Dark Comedy at Its Darkest",
    description: "An introduction to Suzuki Matsuo, leader of Otona Keikaku, whose toxic humor and grotesque beauty invite comparison with Martin McDonagh and Todd Solondz.",
    tags: ['Japanese Theater', 'Playwright Profile', 'Suzuki Matsuo', 'Otona Keikaku', 'Dark Comedy', 'Guide', 'Comparative Theater'],
    language: 'en',
    content: `If Martin McDonagh makes audiences laugh uncomfortably at violence, and Todd Solondz makes them squirm at human weakness, Suzuki Matsuo does both simultaneously — while adding musical numbers and visual spectacle.

## Who Is Suzuki Matsuo?

Suzuki Matsuo (born 1962) is the founder and leader of Otona Keikaku (Adult Planning), one of Japan's most distinctive theater companies. He is also a novelist, essayist, film director, and actor.

**Key facts:**
- Kishida Kunio Drama Award (1997) for *Funky! The Universe Only Extends as Far as You Can See*
- Founded Otona Keikaku in 1988
- Company members include Sadao Abe and Kankuro Kudo (both now major TV/film stars)
- Novelist: *Welcome to the Quiet Room* (adapted into a film he directed)
- Yomiuri Literature Prize recipient

## The Martin McDonagh Comparison

### What They Share

- **Violence as comedy**: Both make audiences laugh at things they probably shouldn't. Physical violence, psychological cruelty, and moral bankruptcy are played for darkly comic effect
- **Gorgeous language in ugly mouths**: Beautiful, rhythmic dialogue spoken by reprehensible characters
- **Theatrical audacity**: Both push boundaries of taste — deliberately, skillfully, and with a clear artistic purpose
- **Provincial grotesque**: McDonagh's rural Ireland and Matsuo's suburban/marginal Japan both become landscapes of human dysfunction

### The Todd Solondz Connection

Matsuo shares Solondz's willingness to empathize with the worst of human nature:
- **Compassion for the monstrous**: Matsuo's characters are often deeply flawed — hikikomori (shut-ins), addicts, narcissists — yet he finds their humanity
- **Discomfort as aesthetic**: Both artists believe that making audiences uncomfortable is a legitimate and valuable theatrical experience

### Where Matsuo Is Unique

- **The "poison" aesthetic**: Matsuo uses the Japanese concept of *doku* (poison/toxicity) as a positive artistic value. His work is intentionally "toxic" — it challenges, provokes, and refuses to be wholesome
- **Musical grotesque**: Matsuo stages elaborate musical numbers within grotesque narratives. *Kireii* (Beautiful) is a full-scale musical about war orphans that features both gorgeous songs and extreme violence
- **Company as family**: Otona Keikaku has maintained a stable ensemble for over 35 years. Matsuo writes specifically for each actor's strengths and eccentricities

## Essential Works

### "Funky!" (ファンキー!, 1996)

A sci-fi comedy set at the edge of the observable universe. Characters grapple with the limits of perception and existence while being, well, funky. Won the Kishida Prize.

**Western parallel**: The cosmic comedy recalls Douglas Adams's *Hitchhiker's Guide*, but with a more anarchic theatrical energy.

### "Machine Diary" (マシーン日記, 1993)

A hikikomori (recluse) terrorizes his family from his room. Black comedy about domestic dysfunction, power, and the violence that festers in enclosed spaces.

**Western parallel**: The claustrophobic family horror recalls Harold Pinter's *The Homecoming* — a family unit revealed as a power system.

### "Kireii" (キレイ, 2000)

A musical about a girl orphaned by war who passes through various surreal and horrifying environments. Gorgeous songs coexist with graphic violence and sexual content. Matsuo's most ambitious work.

**Western parallel**: *Sweeney Todd* meets *Pan's Labyrinth* — beauty and horror in equal measure.

## The Otona Keikaku Universe

What makes Matsuo especially significant is the ecosystem he has created. Otona Keikaku is not just a theater company — it's a creative family that has produced:
- **Kankuro Kudo**: Japan's most popular TV screenwriter
- **Sadao Abe**: One of Japan's biggest film stars
- **Ryuhei Matsuda**, **Arata Iura**, and numerous other film/TV actors who return to the Otona Keikaku stage

This model — a small theater company that nurtures talent for the entire entertainment industry — is unique to Japan and worth studying.

## Why International Audiences Should Know Matsuo

Matsuo proves that "dark comedy" is not a niche genre but a powerful lens for understanding society. His work shows Japan's underbelly — the loneliness, dysfunction, and repressed rage beneath the surface of one of the world's most orderly societies.

For fans of McDonagh, the Coen Brothers, or anyone who believes that laughter and horror are closer neighbors than we like to admit, Matsuo is essential.`,
  },

  {
    slug: 'guide-iwamatsu-ryo-japans-pinter',
    title: "Ryo Iwamatsu: Japan's Harold Pinter — The Master of Silence and Subtext",
    description: "An introduction to Ryo Iwamatsu, the Japanese playwright whose mastery of silence and subtext invites direct comparison with Harold Pinter and the theater of menace.",
    tags: ['Japanese Theater', 'Playwright Profile', 'Ryo Iwamatsu', 'Quiet Theater', 'Guide', 'Comparative Theater'],
    language: 'en',
    content: `Harold Pinter famously said that what people don't say is as important as what they do say. Ryo Iwamatsu has built an entire career on that principle — creating plays where the most important moments happen in silence, and the most devastating truths are the ones no one speaks aloud.

## Who Is Ryo Iwamatsu?

Ryo Iwamatsu (born 1952) is a playwright, director, and actor who emerged from the Tokyo Kandenchi (Tokyo Dry Battery) theater company and became a key figure in the "quiet theater" movement of the 1990s.

**Key facts:**
- Kishida Kunio Drama Award (1989) for *Futon to Daruma* (Futon and Daruma)
- Active as film and TV actor (recognizable face in Japanese cinema)
- Known for extremely subtle, silence-heavy dramaturgy
- Yomiuri Theater Grand Prize recipient

## The Harold Pinter Comparison

The comparison is almost irresistible — both Iwamatsu and Pinter are masters of what happens between the lines.

### What They Share

- **The pause as weapon**: Both use silence not as empty space but as charged, meaningful dramatic action. In Pinter, a pause can contain a threat. In Iwamatsu, a pause can contain an entire unspoken relationship
- **Subtext over text**: Characters say one thing and mean another. A conversation about the weather is actually about a failing marriage. A discussion about dinner plans is actually a power struggle
- **Domestic menace**: Both set plays in ordinary domestic spaces — living rooms, kitchens — and reveal the quiet violence within them
- **Linguistic precision**: Every word is chosen with extreme care. Nothing is accidental

### Where They Differ

- **Temperature**: Pinter's silences are "hot" — charged with aggression, sexuality, or threat (what critics call "the Pinter pause"). Iwamatsu's silences are "cool" — filled with resignation, awkwardness, or the inability to express feeling
- **Cultural context**: Pinter's characters often *choose* not to speak (as a form of power). Iwamatsu's characters often *cannot* speak — constrained by Japanese social norms that discourage direct emotional expression
- **Violence**: Pinter's plays contain implicit (and sometimes explicit) violence. Iwamatsu's world is gentler — the damage is done through emotional distance, not aggression

### The Carver/Cheever Connection

Iwamatsu's domestic landscapes also recall Raymond Carver's short stories or John Cheever's suburban fiction — ordinary people in ordinary settings, with something terribly wrong just beneath the surface.

## Essential Works

### "Futon and Daruma" (蒲団と達磨, 1988)

A seemingly mundane domestic scene — a futon (bedding), a daruma doll, everyday conversation. But through accumulating silences and deflected topics, the power dynamics and emotional distances within a relationship become devastatingly clear.

**Western parallel**: Pinter's *Betrayal* — where the architecture of a relationship is revealed through what isn't said.

### "Thin Pink Mass" (薄い桃色のかたまり, 2010)

A play in which the central object — the "thin pink mass" of the title — remains ambiguous. What matters is how the characters orbit around it, revealing themselves through their inability to name what's happening.

### "Center Street" (センター街, 1994)

Urban alienation rendered through the fragmented conversations of people who share space but not connection.

## The Japanese Context

To understand Iwamatsu, you need to understand *honne* and *tatemae* — the Japanese distinction between one's true feelings (*honne*) and the social face one presents (*tatemae*). Iwamatsu's entire dramaturgy is built on this gap.

His characters are trapped in *tatemae* — performing politeness, avoiding confrontation — while their *honne* seethes beneath the surface. The drama lies in the rare moments when *honne* breaks through, usually in indirect, easily deniable ways.

This is why Iwamatsu resonates so deeply with Japanese audiences. He dramatizes something every Japanese person recognizes: the exhausting effort of maintaining social harmony, and the loneliness it creates.

## Why International Audiences Should Know Iwamatsu

For those who love Pinter, Iwamatsu offers a fascinating cultural variation. Both are masters of subtext, but the *kind* of subtext is different — reflecting different cultural assumptions about privacy, confrontation, and emotional expression.

Iwamatsu's work also provides a profound entry point into understanding Japanese interpersonal dynamics. If you've ever wondered why silence plays such an important role in Japanese communication, Iwamatsu's plays are the best dramatic explanation available.`,
  },

  {
    slug: 'guide-kera-japans-noel-coward',
    title: "KERA (Keralino Sandorovich): Japan's Noël Coward Meets the Coen Brothers",
    description: "An introduction to KERA, the multi-talented playwright-musician who leads Nylon100°C, with comparisons to Noël Coward, Michael Frayn, and the Coen Brothers.",
    tags: ['Japanese Theater', 'Playwright Profile', 'KERA', 'Nylon100C', 'Comedy', 'Guide', 'Comparative Theater'],
    language: 'en',
    content: `What do you get when you cross Noël Coward's theatrical sophistication, Michael Frayn's structural brilliance, and the Coen Brothers' genre-bending darkly comic sensibility? Something very close to KERA — the stage name of Keralino Sandorovich, one of Japan's most inventive theater-makers.

## Who Is KERA?

KERA (born Kazumi Kobayashi, 1963) is a playwright, director, and musician who leads the theater company Nylon100°C. Before becoming a theater icon, he was the vocalist of the indie band Uchōten (Ecstasy).

**Key facts:**
- Kishida Kunio Drama Award (2001) for *Frozen Beach*
- Founded Nylon100°C in 1993 (successor to his earlier company Gekidan Kenkō)
- Also a musician, film director, and manga artist
- Yomiuri Theater Grand Prize recipient
- Known for long-form works (3–4 hours) that never feel long

## The Noël Coward Connection

### What They Share

- **Sophisticated wit**: Both write comedy that rewards intelligence. The humor comes from observation, timing, and verbal elegance rather than slapstick
- **Social observation**: Both are acute observers of social behavior and class dynamics
- **Genre fluency**: Coward could write intimate two-handers and large-scale revues. KERA moves between intimate comedies and epic theatrical narratives with equal facility
- **Performance as theme**: Both are fascinated by artifice, role-playing, and the theatrical nature of everyday social interaction

## The Michael Frayn Comparison

### What They Share

- **Structural brilliance**: Like Frayn's *Noises Off* (a play within a play within a play), KERA builds intricate dramatic structures where multiple storylines interweave and pay off simultaneously
- **Backstage fascination**: Both love the gap between what audiences see and what happens behind the scenes — literally and metaphorically
- **Comedy of competence**: Both find humor in people trying (and failing) to maintain control of chaotic situations

## The Coen Brothers Connection

### What They Share

- **Genre play**: The Coen Brothers move from noir (*Fargo*) to screwball (*Raising Arizona*) to western (*No Country for Old Men*). KERA similarly refuses to be pinned to one genre — a single play might contain mystery, farce, and genuine pathos
- **Affection for the peculiar**: Both celebrate eccentric characters without condescending to them
- **Beautiful craft in service of strange stories**: Technical excellence (cinematography for the Coens, theatrical staging for KERA) deployed in unexpected contexts

## Essential Works

### "Frozen Beach" (フローズン・ビーチ, 2001)

Four women in a villa on an isolated island. Secrets emerge, identities shift, and reality becomes unreliable. A mystery-comedy that keeps you guessing until the final moment — and then recontextualizes everything you've seen.

**Western parallel**: The structure recalls Agatha Christie's island mysteries, but filtered through the Coen Brothers' love of unreliable narrators. Also comparable to Yasmina Reza's *Art* in how a seemingly light play reveals deep fractures.

### "A Hundred Years of Secrets" (百年の秘密, 2012)

Two women meet as children. The play follows their friendship across an entire century, jumping through decades, wars, and personal upheavals. An epic scope compressed into a single evening of theater.

**Western parallel**: Tom Stoppard's *Arcadia* (two time periods in one play) crossed with Thornton Wilder's *Our Town* (the sweep of ordinary life across time).

### "Cinema and Lovers" (キネマと恋人, 2016)

An homage to golden-age cinema. A character steps out of a movie screen into real life — or does real life step into the movie? A love letter to the magic of storytelling.

**Western parallel**: Woody Allen's *The Purple Rose of Cairo* is the obvious touchstone, and KERA acknowledges the debt.

### "The World Laughs" (世界は笑う, 2022)

Wartime Japan. Comedians try to make people laugh while censorship tightens and war escalates. A play about the responsibility and impossibility of comedy in dark times.

**Western parallel**: Ernst Lubitsch's *To Be or Not to Be* — comedy as resistance under totalitarianism.

## The Nylon100°C Experience

Attending a Nylon100°C production is distinctive:
- **Length**: 3–4 hours is normal, but KERA's pacing means the time flies
- **Ensemble acting**: The company has worked together for decades, achieving a level of ensemble chemistry that most companies can only dream of
- **Comic timing**: The precision of the comedy is extraordinary — millisecond-accurate timing that creates laughter seemingly out of nothing

## Why International Audiences Should Know KERA

KERA proves that sophisticated comedy can be as artistically ambitious as any "serious" drama. His structural innovations, genre experiments, and sheer theatrical inventiveness place him among the most interesting theater-makers working anywhere in the world today.

For Western audiences who love smart, layered comedy — from Coward to the Coens — KERA represents the Japanese contribution to that tradition, and it's a contribution that deserves to be far better known internationally.`,
  },
];

async function main() {
  console.log(`Inserting ${articles.length} articles...`);

  for (const article of articles) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: article.slug },
    });

    if (existing) {
      console.log(`  SKIP (exists): ${article.slug}`);
      continue;
    }

    await prisma.blogPost.create({
      data: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        content: article.content,
        tags: article.tags,
        language: article.language,
        published: true,
        publishedAt: new Date(),
      },
    });
    console.log(`  OK: ${article.slug}`);
  }

  const count = await prisma.blogPost.count({ where: { published: true } });
  console.log(`\nTotal published articles: ${count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
