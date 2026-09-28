var ROLES=[["dealer","Sales dealer"],["marketing","Marketing"],["atasan","Atasan marketing"],["backoffice","Admin backoffice"],["konsumen","Konsumen"]];
var FLOW=[["new","Masuk"],["pending","Approval"],["approved","Disetujui"],["sign","TTD"],["signed","Sudah TTD"],["paid","Dana cair"]];
var STATUS={new:["Baru masuk",""],pending:["Menunggu approval","warn"],approved:["Disetujui",""],rejected:["Ditolak","bad"],sign:["Menunggu TTD konsumen","warn"],signed:["Sudah TTD","ok"],paid:["Dana cair","ok"]};
var ACTOR={new:"marketing",pending:"atasan",approved:"backoffice",sign:"konsumen",signed:"backoffice"};
var DOCS=["KTP","Kartu keluarga","Bukti bayar tanda jadi","Form aplikasi pengajuan"];
var KEY="jkl-kredit-v1";
var state={role:"dealer",sel:null,form:false,apps:[]};

function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function rp(n){return "Rp "+Number(n||0).toLocaleString("id-ID")}
function now(){return new Date().toLocaleString("id-ID",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}
function load(){try{var r=localStorage.getItem(KEY);if(r){state.apps=JSON.parse(r);return}}catch(e){}state.apps=seed()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state.apps))}catch(e){}}
function seed(){
  return [
   {id:"PK-0001",nama:"Budi Santoso",nik:"3201012345670001",lahir:"1990-04-12",kawin:"Kawin",pasangan:"Sri Wahyuni",dealer:"Dealer Maju Jaya",merk:"Honda",model:"Beat",tipe:"CBS",warna:"Hitam",harga:19500000,asuransi:"All risk",dp:4000000,tenor:24,angsuran:800000,docs:DOCS.slice(),status:"pending",log:[["Dealer Maju Jaya","Pengajuan dibuat dan dokumen diunggah","dealer"],["Marketing","Data direview, dikirim ke atasan","marketing"]]},
   {id:"PK-0002",nama:"Ayu Lestari",nik:"3273014509950002",lahir:"1995-09-05",kawin:"Belum kawin",pasangan:"",dealer:"Dealer Sinar Motor",merk:"Yamaha",model:"NMAX",tipe:"ABS",warna:"Abu-abu",harga:32000000,asuransi:"TLO",dp:8000000,tenor:36,angsuran:790000,docs:DOCS.slice(),status:"new",log:[["Dealer Sinar Motor","Pengajuan dibuat dan dokumen diunggah","dealer"]]}
  ]}
function nextId(){var m=0;state.apps.forEach(function(a){m=Math.max(m,parseInt(a.id.slice(3),10))});return "PK-"+String(m+1).padStart(4,"0")}
function byId(id){return state.apps.filter(function(a){return a.id===id})[0]}
function needs(a){return ACTOR[a.status]===state.role}
function count(r){return state.apps.filter(function(a){return ACTOR[a.status]===r}).length}
function push(a,who,msg){a.log.push([who,msg,state.role])}
function roleName(k){return ROLES.filter(function(r){return r[0]===k})[0][1]}

function renderRoles(){
  document.getElementById("roles").innerHTML=ROLES.map(function(r){
    var n=count(r[0]);
    return '<button class="role" aria-pressed="'+(state.role===r[0])+'" data-role="'+r[0]+'">'+r[1]+(n?'<span class="n" aria-label="'+n+' perlu tindakan">'+n+'</span>':'')+'</button>'}).join("");
  Array.prototype.forEach.call(document.querySelectorAll("[data-role]"),function(b){b.onclick=function(){state.role=b.dataset.role;state.form=false;render()}});
}
function renderList(){
  document.getElementById("newBtnWrap").innerHTML=state.role==="dealer"?'<button class="btn" id="newBtn">Buat pengajuan</button>':"";
  var nb=document.getElementById("newBtn");if(nb)nb.onclick=function(){state.form=true;state.sel=null;render()};
  var el=document.getElementById("list");
  if(!state.apps.length){el.innerHTML='<div class="empty">Belum ada pengajuan.</div>';return}
  el.innerHTML=state.apps.slice().reverse().map(function(a){
    var s=STATUS[a.status];
    return '<button class="item'+(needs(a)?' mine':'')+'" data-id="'+a.id+'" aria-current="'+(state.sel===a.id)+'"><div class="r1"><strong style="font-weight:500">'+esc(a.nama)+'</strong><span class="pill '+s[1]+'">'+s[0]+'</span></div><div class="r2">'+a.id+' · '+esc(a.merk)+' '+esc(a.model)+' · '+rp(a.harga)+'</div></button>'}).join("");
  Array.prototype.forEach.call(el.querySelectorAll("[data-id]"),function(b){b.onclick=function(){state.sel=b.dataset.id;state.form=false;render()}});
}
function renderDetail(){
  var el=document.getElementById("detail");
  if(state.form){renderForm(el);return}
  var a=state.sel&&byId(state.sel);
  if(!a){el.innerHTML='<div class="empty">Pilih pengajuan di sebelah kiri.'+(state.role==="dealer"?' Atau buat pengajuan baru.':' Pengajuan bertanda garis kuning menunggu tindakan Anda.')+'</div>';return}
  var s=STATUS[a.status],idx=-1;FLOW.forEach(function(f,i){if(f[0]===a.status)idx=i});
  var steps=a.status==="rejected"?'<span class="cur">Ditolak</span>':FLOW.map(function(f,i){return '<span class="'+(i<idx?'done':i===idx?'cur':'')+'">'+f[1]+'</span>'}).join("");
  var h='<div class="ph"><div><h2 style="font-size:17px">'+esc(a.nama)+'</h2><div style="color:var(--mute);font-size:13px">'+a.id+'</div></div><span class="pill '+s[1]+'">'+s[0]+'</span></div><div class="body">';
  h+='<div class="steps" aria-label="Tahapan">'+steps+'</div>';
  h+=actionArea(a);
  h+='<div class="sec-t">Data konsumen</div><dl><dt>Nama</dt><dd>'+esc(a.nama)+'</dd><dt>NIK</dt><dd>'+esc(a.nik)+'</dd><dt>Tanggal lahir</dt><dd>'+esc(a.lahir)+'</dd><dt>Status perkawinan</dt><dd>'+esc(a.kawin)+'</dd>'+(a.pasangan?'<dt>Data pasangan</dt><dd>'+esc(a.pasangan)+'</dd>':'')+'</dl>';
  h+='<div class="sec-t">Data kendaraan</div><dl><dt>Dealer</dt><dd>'+esc(a.dealer)+'</dd><dt>Kendaraan</dt><dd>'+esc(a.merk)+' '+esc(a.model)+' '+esc(a.tipe)+', '+esc(a.warna)+'</dd><dt>Harga</dt><dd>'+rp(a.harga)+'</dd></dl>';
  h+='<div class="sec-t">Data pinjaman</div><dl><dt>Asuransi</dt><dd>'+esc(a.asuransi)+'</dd><dt>Down payment</dt><dd>'+rp(a.dp)+'</dd><dt>Lama kredit</dt><dd>'+a.tenor+' bulan</dd><dt>Angsuran per bulan</dt><dd>'+rp(a.angsuran)+'</dd></dl>';
  h+='<div class="sec-t">Dokumen terunggah</div><div style="margin-bottom:16px">'+a.docs.map(function(d){return '<span class="pill ok" style="margin-right:6px">'+esc(d)+'</span>'}).join("")+'</div>';
  if(["sign","signed","paid"].indexOf(a.status)>-1)h+=docPreview(a);
  h+='<div class="sec-t">Riwayat</div><ul class="log">'+a.log.map(function(l){return '<li><strong style="font-weight:500">'+esc(l[0])+'</strong>: '+esc(l[1])+'</li>'}).join("")+'</ul></div>';
  el.innerHTML=h;bindActions(a);
}
function actionArea(a){
  var r=state.role,st=a.status,h="";
  if(ACTOR[st]!==r){
    if(ACTOR[st])return '<div class="note">Saat ini menunggu tindakan: '+roleName(ACTOR[st])+'.</div>';
    return "";
  }
  if(st==="new")return '<div class="actions"><button class="btn" data-act="submit">Submit ke atasan</button></div>';
  if(st==="pending")return '<label>Catatan (wajib jika ditolak)<input id="note" maxlength="120"></label><div class="err" id="noteErr"></div><div class="actions" style="margin-top:0"><button class="btn ok" data-act="approve">Setujui</button><button class="btn bad" data-act="reject">Tolak</button></div>';
  if(st==="approved")return '<div class="actions"><button class="btn" data-act="gen">Buat kontrak dan PO, kirim untuk TTD</button></div>';
  if(st==="sign")return '<div class="note">Baca dokumen di bawah, lalu ketik nama lengkap Anda sebagai tanda tangan.</div><label>Nama lengkap sesuai KTP<input id="sig" autocomplete="off"></label><div class="err" id="sigErr"></div><div class="actions" style="margin-top:0"><button class="btn ok" data-act="sign">Tanda tangan dokumen</button></div>';
  if(st==="signed")return '<div class="note">Dokumen TTD sudah tersimpan otomatis. Verifikasi lalu cairkan dana.</div><div class="actions" style="margin-top:0"><button class="btn ok" data-act="pay">Cairkan dana</button></div>';
  return h;
}
function docPreview(a){
  var sg=a.status!=="sign";
  return '<div class="sec-t">Dokumen</div><div class="doc"><h3>Kontrak pembiayaan '+a.id+'</h3>Pihak pertama PT. JKL dan '+esc(a.nama)+' (NIK '+esc(a.nik)+') menyepakati pembiayaan '+esc(a.merk)+' '+esc(a.model)+' senilai '+rp(a.harga-a.dp)+', tenor '+a.tenor+' bulan, angsuran '+rp(a.angsuran)+' per bulan.<br>Tanda tangan konsumen: <strong style="font-weight:500">'+(sg?esc(a.ttd||a.nama):'belum ditandatangani')+'</strong></div><div class="doc"><h3>Purchase order ke '+esc(a.dealer)+'</h3>Pemesanan unit '+esc(a.merk)+' '+esc(a.model)+' '+esc(a.tipe)+' warna '+esc(a.warna)+', harga '+rp(a.harga)+'. '+(sg?'PO terkirim ke dealer.':'PO dikirim ke dealer setelah kontrak ditandatangani.')+'</div>';
}
function bindActions(a){
  Array.prototype.forEach.call(document.querySelectorAll("[data-act]"),function(b){b.onclick=function(){act(a,b.dataset.act)}});
}
function act(a,k){
  var by=roleName(state.role);
  if(k==="submit"){a.status="pending";push(a,by,"Data direview dan dikirim ke atasan")}
  else if(k==="approve"){var n=document.getElementById("note").value.trim();a.status="approved";push(a,by,"Pengajuan disetujui"+(n?". Catatan: "+n:""))}
  else if(k==="reject"){var n2=document.getElementById("note").value.trim();if(!n2){document.getElementById("noteErr").textContent="Isi catatan alasan penolakan.";return}a.status="rejected";push(a,by,"Pengajuan ditolak. Alasan: "+n2)}
  else if(k==="gen"){a.status="sign";push(a,by,"Kontrak dan PO dibuat otomatis, dikirim ke konsumen untuk TTD")}
  else if(k==="sign"){var v=document.getElementById("sig").value.trim();if(v.toLowerCase()!==a.nama.toLowerCase()){document.getElementById("sigErr").textContent="Nama harus sama dengan "+a.nama+".";return}a.ttd=v;a.status="signed";push(a,v,"Dokumen ditandatangani digital, PO terkirim ke dealer")}
  else if(k==="pay"){a.status="paid";push(a,by,"Dana dicairkan ke dealer")}
  save();render();
}
function renderForm(el){
  var h='<div class="ph"><h2 style="font-size:17px">Pengajuan kredit baru</h2><button class="btn sec" id="cancel">Batal</button></div><div class="body"><form id="f" novalidate>';
  h+='<fieldset><legend>Data konsumen</legend><div class="grid"><div><label for="nama">Nama<input id="nama" name="nama"></label><div class="err" data-e="nama"></div></div><div><label for="nik">NIK (16 digit)<input id="nik" name="nik" inputmode="numeric" maxlength="16"></label><div class="err" data-e="nik"></div></div><div><label for="lahir">Tanggal lahir<input id="lahir" name="lahir" type="date"></label><div class="err" data-e="lahir"></div></div><div><label for="kawin">Status perkawinan<select id="kawin" name="kawin"><option>Belum kawin</option><option>Kawin</option><option>Cerai</option></select></label></div><div id="pas" style="display:none"><label for="pasangan">Nama pasangan<input id="pasangan" name="pasangan"></label><div class="err" data-e="pasangan"></div></div></div></fieldset>';
  h+='<fieldset><legend>Data kendaraan</legend><div class="grid"><div><label for="dealer">Dealer<input id="dealer" name="dealer" value="Dealer Maju Jaya"></label><div class="err" data-e="dealer"></div></div><div><label for="merk">Merk<input id="merk" name="merk"></label><div class="err" data-e="merk"></div></div><div><label for="model">Model<input id="model" name="model"></label><div class="err" data-e="model"></div></div><div><label for="tipe">Tipe<input id="tipe" name="tipe"></label><div class="err" data-e="tipe"></div></div><div><label for="warna">Warna<input id="warna" name="warna"></label><div class="err" data-e="warna"></div></div><div><label for="harga">Harga (Rp)<input id="harga" name="harga" type="number" min="0"></label><div class="err" data-e="harga"></div></div></div></fieldset>';
  h+='<fieldset><legend>Data pinjaman</legend><div class="grid"><div><label for="asuransi">Asuransi<select id="asuransi" name="asuransi"><option>All risk</option><option>TLO</option><option>Tanpa asuransi</option></select></label></div><div><label for="dp">Down payment (Rp)<input id="dp" name="dp" type="number" min="0"></label><div class="err" data-e="dp"></div></div><div><label for="tenor">Lama kredit<select id="tenor" name="tenor"><option value="12">12 bulan</option><option value="24" selected>24 bulan</option><option value="36">36 bulan</option><option value="48">48 bulan</option></select></label></div><div><label>Estimasi angsuran per bulan<input id="ang" readonly value="Rp 0"></label></div></div><div style="font-size:12px;color:var(--mute);margin-top:8px">Estimasi memakai bunga flat 9% per tahun. Nilai final ditetapkan saat approval.</div></fieldset>';
  h+='<fieldset><legend>Dokumen</legend><div class="grid">'+DOCS.map(function(d,i){return '<div><label for="d'+i+'">'+d+'<input id="d'+i+'" type="file" data-doc="'+d+'" accept="image/*,application/pdf"></label></div>'}).join("")+'</div><div class="err" data-e="docs"></div></fieldset>';
  h+='<button class="btn" type="submit">Kirim pengajuan</button></form></div>';
  el.innerHTML=h;
  var f=document.getElementById("f");
  function calc(){var hg=+f.harga.value||0,dp=+f.dp.value||0,t=+f.tenor.value;var pok=Math.max(hg-dp,0);var ang=Math.round(pok*(1+0.09*t/12)/t/1000)*1000;f.ang.value=rp(ang);return ang}
  ["harga","dp","tenor"].forEach(function(n){f[n].oninput=calc});
  f.kawin.onchange=function(){document.getElementById("pas").style.display=f.kawin.value==="Kawin"?"block":"none"};
  document.getElementById("cancel").onclick=function(){state.form=false;render()};
  f.onsubmit=function(ev){
    ev.preventDefault();
    var err={};Array.prototype.forEach.call(f.querySelectorAll("[data-e]"),function(e){e.textContent=""});
    ["nama","lahir","dealer","merk","model","tipe","warna"].forEach(function(n){if(!f[n].value.trim())err[n]="Wajib diisi."});
    if(!/^\d{16}$/.test(f.nik.value))err.nik="NIK harus 16 digit angka.";
    if(f.kawin.value==="Kawin"&&!f.pasangan.value.trim())err.pasangan="Isi nama pasangan.";
    if(!(+f.harga.value>0))err.harga="Isi harga kendaraan.";
    if(!(+f.dp.value>=0)||f.dp.value==="")err.dp="Isi down payment.";
    else if(+f.dp.value>=+f.harga.value)err.dp="Down payment harus lebih kecil dari harga.";
    var docs=[];Array.prototype.forEach.call(f.querySelectorAll("[data-doc]"),function(i){if(i.files&&i.files.length)docs.push(i.dataset.doc)});
    if(docs.length<DOCS.length)err.docs="Unggah semua dokumen. Kurang: "+DOCS.filter(function(d){return docs.indexOf(d)<0}).join(", ")+".";
    var keys=Object.keys(err);
    if(keys.length){keys.forEach(function(k){var e=f.querySelector('[data-e="'+k+'"]');if(e)e.textContent=err[k]});var first=f.querySelector('[data-e="'+keys[0]+'"]');if(first)first.scrollIntoView({block:"center"});return}
    var a={id:nextId(),nama:f.nama.value.trim(),nik:f.nik.value,lahir:f.lahir.value,kawin:f.kawin.value,pasangan:f.kawin.value==="Kawin"?f.pasangan.value.trim():"",dealer:f.dealer.value.trim(),merk:f.merk.value.trim(),model:f.model.value.trim(),tipe:f.tipe.value.trim(),warna:f.warna.value.trim(),harga:+f.harga.value,asuransi:f.asuransi.value,dp:+f.dp.value,tenor:+f.tenor.value,angsuran:calc(),docs:docs,status:"new",log:[]};
    a.log.push([a.dealer,"Pengajuan dibuat dan dokumen diunggah","dealer"]);
    state.apps.push(a);state.sel=a.id;state.form=false;save();render();
  };
}
function render(){renderRoles();renderList();renderDetail()}
load();render();
