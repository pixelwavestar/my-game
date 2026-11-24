// Ki Clash Z LAN server - zero dependencies. Run: node server.js
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto'),os=require('os');
const PORT=+process.env.PORT||3000,room=[];
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];if(u!=='/'&&u!=='/index.html'){s.writeHead(404);return s.end('not found')}
 fs.readFile(path.join(__dirname,'index.html'),(e,d)=>{if(e){s.writeHead(500);return s.end('index.html missing')}s.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});s.end(d)})});
function frame(op,buf){const n=buf.length,h=n<126?Buffer.from([0x80|op,n]):n<65536?Buffer.from([0x80|op,126,n>>8,n&255]):null;return Buffer.concat([h,buf])}
const send=(c,o)=>{try{c.write(frame(1,Buffer.from(JSON.stringify(o))))}catch(e){}};
const peers=()=>room.forEach(c=>send(c,{t:'peer',n:room.length}));
srv.on('upgrade',(q,sock)=>{if(q.url.split('?')[0]!=='/ws'||!q.headers['sec-websocket-key'])return sock.destroy();
 sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+crypto.createHash('sha1').update(q.headers['sec-websocket-key']+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64')+'\r\n\r\n');
 if(room.length>=2){send(sock,{t:'full'});return sock.end()}
 sock.setNoDelay(true);sock.r=room.some(c=>c.r===0)?1:0;room.push(sock);send(sock,{t:'role',r:sock.r});peers();console.log('player joined as P'+(sock.r+1));
 let buf=Buffer.alloc(0);
 const drop=()=>{const i=room.indexOf(sock);if(i>=0){room.splice(i,1);console.log('player left');peers()}};
 sock.on('data',d=>{buf=Buffer.concat([buf,d]);for(;;){if(buf.length<2)return;const op=buf[0]&15;let len=buf[1]&127,o=2;if(len===126){if(buf.length<4)return;len=buf.readUInt16BE(2);o=4}else if(len===127){return sock.destroy()}
  const m=(buf[1]&128)?4:0;if(buf.length<o+m+len)return;let p=Buffer.from(buf.subarray(o+m,o+m+len));if(m)for(let i=0;i<len;i++)p[i]^=buf[o+i%4];buf=buf.subarray(o+m+len);
  if(op===8){sock.end();return drop()}else if(op===9)sock.write(frame(10,p));else if(op===1){const t=p.toString();room.forEach(c=>{if(c!==sock)try{c.write(frame(1,Buffer.from(t)))}catch(e){}})}}});
 sock.on('close',drop);sock.on('error',drop)});
const dgram=require('dgram'),udp=dgram.createSocket('udp4');
udp.on('error',()=>{});
udp.bind(()=>{try{udp.setBroadcast(true)}catch(e){}setInterval(()=>{const m=Buffer.from('KCZ|'+PORT),t=new Set(['255.255.255.255']);
 for(const l of Object.values(os.networkInterfaces()))for(const a of l)if((a.family==='IPv4'||a.family===4)&&!a.internal&&a.netmask){const ip=a.address.split('.').map(Number),mk=a.netmask.split('.').map(Number);t.add(ip.map((v,i)=>v|(~mk[i]&255)).join('.'))}
 t.forEach(x=>udp.send(m,41234,x,()=>{}))},1000)});
srv.listen(PORT,'0.0.0.0',()=>{console.log('Ki Clash Z LAN server running. Open on every device (same Wi-Fi):');
 for(const l of Object.values(os.networkInterfaces()))for(const a of l)if((a.family==='IPv4'||a.family===4)&&!a.internal)console.log('   http://'+a.address+':'+PORT)});
