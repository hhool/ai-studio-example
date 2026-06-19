import r2 from "../src/lib/storage/r2Adapter";

async function run() {
  const key = `tests/r2-test-${Date.now()}.txt`;
  try {
    // request presigned PUT URL
    const url = await r2.getPresignedPutUrl(key, 60);

    // upload a small test payload using global fetch; do NOT log the URL
    const res = await fetch(url, {
      method: "PUT",
      headers: { "content-type": "text/plain" },
      body: "r2 test payload",
    });

    console.log('upload_status=' + res.status);

    // stat the object
    const info = await r2.statObject(key);
    console.log('stat=', info ? `size=${info.size}` : 'missing');

    // delete the object
    const deleted = await r2.deleteObject(key);
    console.log('deleted=', deleted ? 'ok' : 'failed');
  } catch (e: any) {
    console.error('r2 test error', e?.message || e);
    process.exitCode = 2;
  }
}

run();
