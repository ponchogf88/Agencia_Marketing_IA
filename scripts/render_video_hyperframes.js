/**
 * HYPERFRAMES SHOT-LIST BUILDER (pre-production, Code-to-Video step 1)
 *
 * What this does:
 *   Takes a storyboard JSON (shots with on-screen text and durations) and
 *   produces a structured HyperFrames shot list for the 60-second vertical
 *   video package (1080x1920, 30 fps): each shot gets start/end times,
 *   kinetic-typography text, and safe-zone notes.
 *
 * What this does NOT do:
 *   It does NOT render MP4 video. There is no video-rendering engine in
 *   this repository; actual rendering is roadmap and needs an external
 *   video service (e.g. Kling / Runway, see .env.example section 4).
 *   Do not describe this script as a video renderer.
 *
 * Storyboard JSON format:
 *   {
 *     "title": "Weekly Intelligence — W35",
 *     "shots": [
 *       { "text": "AI just changed the rules again.", "durationSeconds": 8, "style": "hook" },
 *       { "text": "Here are the 5 stories that matter.", "durationSeconds": 12 }
 *     ]
 *   }
 *   Total duration must be <= 60 seconds. Each shot needs non-empty text
 *   and a durationSeconds > 0.
 *
 * Usage:
 *   node scripts/render_video_hyperframes.js [storyboard.json] [--out shotlist.json]
 *   With no argument, a built-in 3-shot sample storyboard is used.
 *   Output is JSON on stdout (or written to --out).
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const FORMAT = { width: 1080, height: 1920, fps: 30, maxSeconds: 60 };
const SAFE_ZONE = 'Keep on-screen text inside the central 1080x1420 area (top/bottom 250px reserved for platform UI).';

const SAMPLE_STORYBOARD = {
  title: 'Sample — Weekly Intelligence 60s package',
  shots: [
    { text: 'AI just changed the rules again.', durationSeconds: 8, style: 'hook' },
    { text: 'Here are the 5 stories that matter this week.', durationSeconds: 12, style: 'setup' },
    { text: 'Follow for the full breakdown.', durationSeconds: 6, style: 'cta' },
  ],
};

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { input: null, out: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--out' && argv[i + 1]) {
      args.out = argv[i + 1];
      i += 1;
    } else if (!argv[i].startsWith('--')) {
      args.input = argv[i];
    } else {
      fail(`unknown argument: ${argv[i]}`);
    }
  }
  return args;
}

function loadStoryboard(inputPath) {
  if (!inputPath) return { storyboard: SAMPLE_STORYBOARD, source: 'built-in sample' };
  let raw;
  try {
    raw = fs.readFileSync(path.resolve(inputPath), 'utf8');
  } catch (err) {
    fail(`cannot read storyboard file ${inputPath}: ${err.message}`);
  }
  try {
    return { storyboard: JSON.parse(raw), source: inputPath };
  } catch (err) {
    fail(`storyboard file is not valid JSON: ${err.message}`);
  }
}

function buildShotList(storyboard) {
  if (!storyboard || !Array.isArray(storyboard.shots) || storyboard.shots.length === 0) {
    fail('storyboard must have a non-empty "shots" array');
  }
  const totalSeconds = storyboard.shots.reduce((sum, shot, index) => {
    if (typeof shot.text !== 'string' || shot.text.trim() === '') {
      fail(`shot ${index + 1} needs non-empty "text"`);
    }
    if (typeof shot.durationSeconds !== 'number' || shot.durationSeconds <= 0) {
      fail(`shot ${index + 1} needs "durationSeconds" > 0`);
    }
    return sum + shot.durationSeconds;
  }, 0);
  if (totalSeconds > FORMAT.maxSeconds) {
    fail(`total duration ${totalSeconds}s exceeds the 60s package limit`);
  }

  let cursor = 0;
  const shots = storyboard.shots.map((shot, index) => {
    const item = {
      shot: index + 1,
      startSeconds: cursor,
      endSeconds: cursor + shot.durationSeconds,
      durationSeconds: shot.durationSeconds,
      text: shot.text.trim(),
      style: shot.style || 'body',
      kineticTypography: true,
      safeZoneNote: SAFE_ZONE,
    };
    cursor += shot.durationSeconds;
    return item;
  });

  return {
    title: storyboard.title || 'Untitled 60s package',
    format: FORMAT,
    totalSeconds,
    shotCount: shots.length,
    note: 'Shot list only — this file is a pre-production artifact. It does not contain rendered video.',
    shots,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const { storyboard, source } = loadStoryboard(args.input);
  const shotList = buildShotList(storyboard);
  const output = JSON.stringify(shotList, null, 2);
  if (args.out) {
    fs.writeFileSync(path.resolve(args.out), `${output}\n`, 'utf8');
    console.log(`Shot list written to ${args.out} (${shotList.shotCount} shots, ${shotList.totalSeconds}s, source: ${source}).`);
  } else {
    console.log(output);
  }
}

main();
