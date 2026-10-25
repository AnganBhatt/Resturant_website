/* Menu: edit this list. Put real photos in images/<img>.jpg (e.g. images/kacchi-biryani.jpg) and they replace the illustrations automatically. */
const WA = '8801XXXXXXXXX'; // restaurant WhatsApp number with country code
const M = [
    { id: 1, n: 'Seekh Kebab', c: 'Starters', p: 380, img: 'seekh-kebab', t: ['🌶 Spicy'], d: 'Minced beef skewers with green chilli and coriander, grilled over charcoal. Served with mint chutney.' },
    { id: 2, n: 'Fuchka Chaat', c: 'Starters', p: 180, img: 'fuchka-chaat', t: ['Veg'], d: 'Crisp shells filled with spiced chickpeas, tamarind water and crunchy sev.' },
    { id: 3, n: 'Hilsa Fry', c: 'Mains', p: 650, img: 'hilsa-fry', t: ['Chef pick'], d: 'Fresh ilish marinated in turmeric and mustard, pan-fried until crisp. Served with lemon and onion.' },
    { id: 4, n: 'Mutton Rezala', c: 'Mains', p: 560, img: 'mutton-rezala', t: ['Mild'], d: 'Tender mutton in a creamy white gravy of yoghurt, cashew and green cardamom.' },
    { id: 5, n: 'Chicken Roast', c: 'Mains', p: 340, img: 'chicken-roast', t: ['Popular'], d: 'Dhaka-style sweet and savoury roast with caramelised onions and a hint of rose water.' },
    { id: 6, n: 'Kacchi Biryani', c: 'Rice & Bread', p: 520, img: 'kacchi-biryani', t: ['Chef pick', '🌶 Spicy'], d: 'Mutton and aromatic rice slow-cooked together in a sealed pot. Served with borhani.' },
    { id: 7, n: 'Beef Tehari', c: 'Rice & Bread', p: 390, img: 'beef-tehari', t: ['Popular'], d: 'Mustard-oil rice cooked with tender beef cubes, green chilli and whole spices.' },
    { id: 8, n: 'Morog Polao', c: 'Rice & Bread', p: 420, img: 'morog-polao', t: ['Mild'], d: 'Fragrant polao rice with ghee, saffron and a whole-spice chicken roast.' },
    { id: 9, n: 'Butter Naan', c: 'Rice & Bread', p: 90, img: 'butter-naan', t: ['Veg'], d: 'Soft clay-oven naan brushed with butter. Perfect with rezala or roast.' },
    { id: 10, n: 'Firni', c: 'Sweets & Drinks', p: 160, img: 'firni', t: ['Veg'], d: 'Slow-cooked rice pudding with cardamom, pistachio and a touch of rose.' },
    { id: 11, n: 'Rose Falooda', c: 'Sweets & Drinks', p: 240, img: 'falooda', t: ['Veg'], d: 'Rose milk layered with vermicelli, basil seeds, jelly and a scoop of ice cream.' },
    { id: 12, n: 'Borhani', c: 'Sweets & Drinks', p: 120, img: 'borhani', t: ['Veg'], d: 'Spiced yoghurt drink with mint and black salt. The classic partner to biryani.' }];
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const money = n => '৳' + n.toLocaleString('en-IN');
const pic = (k, a) => `<img src="images/${k}.jpg" alt="${a}" loading="lazy" onerror="this.onerror=null;this.src=(window.__IMG&&__IMG['${k}'])||'images/${k}.svg'">`;
$$('img[data-k]').forEach(i => { const k = i.dataset.k; i.onerror = () => { i.onerror = null; i.src = (window.__IMG && window.__IMG[k]) || 'images/' + k + '.svg' }; i.src = 'images/' + k + '.jpg' });
let cat = 'All', order = {};
try { order = JSON.parse(localStorage.getItem('ember-order')) || {} } catch (e) { }
const cats = ['All', ...new Set(M.map(x => x.c))];
$('#tabs').innerHTML = cats.map(c => `<button class="tab" data-t="${c}" aria-pressed="${c === cat}">${c}</button>`).join('');
function menu() {
    $('#mgrid').innerHTML = M.filter(x => cat === 'All' || x.c === cat).map(x => { const q = order[x.id] || 0; return `<article class="mc"><div class="mimg">${pic(x.img, x.n)}<div class="chips">${x.t.map(t => `<span>${t}</span>`).join('')}</div></div><div class="mb"><h3>${x.n}</h3><p>${x.d}</p><div class="mrow"><b class="price">${money(x.p)}</b>${q ? `<div class="qtyb"><button data-o="${x.id}:-1" aria-label="Less ${x.n}">−</button><b>${q}</b><button data-o="${x.id}:1" aria-label="More ${x.n}">+</button></div>` : `<button class="add" data-o="${x.id}:1">Add</button>`}</div></div></article>` }).join('');
}
function bar() {
    const ids = Object.keys(order).filter(k => order[k] > 0); let n = 0, t = 0, lines = [];
    ids.forEach(k => { const x = M.find(m => m.id == k); n += order[k]; t += x.p * order[k]; lines.push(`${order[k]} x ${x.n} (${money(x.p * order[k])})`) });
    $('#obar').classList.toggle('on', n > 0); $('#oc').textContent = n + (n === 1 ? ' item' : ' items'); $('#ot').textContent = money(t);
    $('#owa').href = `https://wa.me/${WA}?text=` + encodeURIComponent('Hello Ember & Spice, I would like to order:\n' + lines.join('\n') + `\nTotal: ${money(t)}\nName:\nAddress:`);
    try { localStorage.setItem('ember-order', JSON.stringify(order)) } catch (e) { }
}
document.addEventListener('click', e => {
    const t = e.target.closest('[data-t]'), o = e.target.closest('[data-o]');
    if (t) { cat = t.dataset.t; $$('.tab').forEach(b => b.setAttribute('aria-pressed', b === t)); menu() }
    if (o) { const [i, d] = o.dataset.o.split(':'); order[i] = Math.max(0, (order[i] || 0) + +d); menu(); bar(); if (d === '1' && order[i] === 1) { const k = $('#toast'); k.textContent = 'Added to your order'; k.classList.add('on'); setTimeout(() => k.classList.remove('on'), 1400) } }
});
$('#oclear').onclick = () => { order = {}; menu(); bar() };
const hd = $('#hd'); addEventListener('scroll', () => hd.classList.toggle('solid', scrollY > 40));
$('#burger').onclick = () => { const o = $('#links').classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o) };
$$('#links a').forEach(a => a.onclick = () => { $('#links').classList.remove('open') });
const d = new Date(); $('#date').min = d.toISOString().slice(0, 10); $('#date').value = d.toISOString().slice(0, 10);
$('#rf').onsubmit = e => { e.preventDefault(); $('#rmsg').textContent = 'Thank you! We will call you within 30 minutes to confirm.'; e.target.reset() };
menu(); bar();
