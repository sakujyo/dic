function prepare() {
	chrome.storage.local.get(["dic"], (value) => {
		tag(value["dic"]);
	});
}

function tag(dic) {
	if (document.location.toString().indexOf("translate.google.co.jp/?") > -1) {
		//let k = document.getElementsByClassName('gt-card-ttl-txt')[1].innerText;
		let k = document.getElementsByClassName('gt-ct-text')[0].innerText;
		let v = document.getElementsByClassName('tlid-translation translation')[0].innerText;
		//console.log(k + ': ' + v);
		dic[k.toLowerCase()] = v;
		//delete dic[''];
		chrome.storage.local.set({'dic': dic}, () => {});
		return;
	}
	let b = document.body.innerHTML;
	var d = '';
	var i = 0;
	for (var m of b.matchAll(/<\/{0,1}script[^>]*>/gi)) {
		if (m == '<\/script>') {
			i = m.index + m[0].length;
		} else {
			d += b.substring(i, m.index);
		}
	}
	let indic = (s) => {
		let m = s.toLowerCase();
		return m in dic ||
			(m.endsWith('s') || m.endsWith('d')) && m.substring(0, m.length - 1) in dic ||
			(m.endsWith('es') || m.endsWith('ed')) && m.substring(0, m.length - 2) in dic ||
			(m.endsWith('ies')) && m.substring(0, m.length - 3) + 'y' in dic ||
			(m.endsWith('ing')) && m.substring(0, m.length - 3) in dic ||
			(m.endsWith('ing')) && m.substring(0, m.length - 3) + 'e' in dic ||
			(m.endsWith('red')) && m.substring(0, m.length - 3) in dic ||
			(m.endsWith('ied')) && m.substring(0, m.length - 3) + 'y' in dic ||
			(m.endsWith('ted')) && m.substring(0, m.length - 3) in dic ||
			(m.endsWith('med')) && m.substring(0, m.length - 3) in dic ||
			(m.endsWith('ring')) && m.substring(0, m.length - 4) in dic ||
			(m.endsWith('ning')) && m.substring(0, m.length - 4) in dic ||
			0;
	}
	let refer = (s) => {
		let m = s.toLowerCase();
		if (m in dic) {
			return dic[m];
		} else if ((m.endsWith('s') || (m.endsWith('d'))) && m.substring(0, m.length - 1) in dic) {
			return dic[m.substring(0, m.length - 1)];
		} else if ((m.endsWith('es') || m.endsWith('ed')) && m.substring(0, m.length - 2) in dic) {
			return dic[m.substring(0, m.length - 2)];
		} else if ((m.endsWith('ies')) && m.substring(0, m.length - 3) + 'y' in dic) {
			return dic[m.substring(0, m.length - 3) + 'y']
		} else if ((m.endsWith('ing')) && m.substring(0, m.length - 3) in dic) {
			return dic[m.substring(0, m.length - 3)];
		} else if ((m.endsWith('ing')) && m.substring(0, m.length - 3) + 'e' in dic) {
			return dic[m.substring(0, m.length - 3) + 'e'];
		} else if ((m.endsWith('red')) && m.substring(0, m.length - 3) in dic) {
			return dic[m.substring(0, m.length - 3)];
		} else if ((m.endsWith('ied')) && m.substring(0, m.length - 3) + 'y' in dic) {
			return dic[m.substring(0, m.length - 3) + 'y'];
		} else if ((m.endsWith('ted')) && m.substring(0, m.length - 3) in dic) {
			return dic[m.substring(0, m.length - 3)];
		} else if ((m.endsWith('med')) && m.substring(0, m.length - 3) in dic) {
			return dic[m.substring(0, m.length - 3)];
		} else if ((m.endsWith('ring')) && m.substring(0, m.length - 4) in dic) {
			return dic[m.substring(0, m.length - 4)];
		} else if ((m.endsWith('ning')) && m.substring(0, m.length - 4) in dic) {
			return dic[m.substring(0, m.length - 4)];
		}
	}

	var s = '';
	var i = 1;
	for (var m of d.matchAll(/((?:<[^>]+>)*)([^<]*)/gi)) {
		s += m[1];
		s += m[2].replace(/[a-z]{2,}/gi, (m, o, s) => {
			//let style = m in dic ? 'id="d"' : '';
			let style = indic(m) ? 'id="d"' : '';
			return '<span class="w" ' + style + 'tabindex=' + i++ + '>' + m + '</span>' 
		});
	}
	document.body.innerHTML = s + '<div id="dic"></div><style>\n#d { background-color: #f0f0f0; }\n.w {\n background-color: #fcfcfc;\n}\n#dic { position:fixed; display: block; font-size: 9pt; width: 68%; height: 12%; left: 18%; top: 1%; color: #fff; background-color: rgba(35, 35, 35, 0.6); padding: 5px; border-radius: 4px; box-shadow: 0 0 6px -1px #a3a3a3; z-index: 2147483647 }\n:focus { border-style: solid none solid; }\n</style>';

	let show = (word) => {
			//let word = e.target.textContent;
			//if (word in dic) {
			if (indic(word)) {
				//document.getElementById('dic').textContent = dic[word].substring(0, 240);
				document.getElementById('dic').textContent = refer(word).substring(0, 240);
			} else {
				document.getElementById('dic').textContent = '';
				window.open('https://translate.google.co.jp/?hl=ja#view=home&op=translate&sl=en&tl=ja&text=' + word); // CTRL-w to close translation tab
			}
	}
	for (var el of document.getElementsByClassName('w')) {
		el.addEventListener('mousedown', (e) => {
			show(e.target.textContent);
		});
		el.addEventListener('keydown', (e) => {
			if (e.key == "Tab") return;
			//if ((e.key != 's') || (e.key != 'Enter')) return;
			if (e.key == "a") {
				let p = e.target.parentElement;
				if (p.tagName == 'A') {
					window.open(p.href);
				}
			} else if (e.key == 'q') {
				let f = (e) => { if (e.tagName == 'BODY') { return 0; } else { return e.offsetTop + f(e.offsetParent); }}
				let renderHeight = window.innerHeight;
				let rh = renderHeight / 2;
				let y = f(e.target) + e.target.offsetHeight / 2 - 1;
				window.scrollTo(0, y - rh);
			}
			if ((e.key != 'w')) return;
			show(e.target.textContent);
		}
		);
	}

}
prepare();
