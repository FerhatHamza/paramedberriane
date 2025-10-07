
/**
 * Worker API stub.
 * Replace with real implementation connected to D1.
 */
addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});
async function handle(request){
  const url = new URL(request.url);
  const path = url.pathname;
  if(path.startsWith('/api/')){
    return new Response(JSON.stringify({ok:true, path}), {status:200, headers:{'Content-Type':'application/json'}});
  }
  return fetch(request);
}
