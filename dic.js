function tag() {
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
	var s = '';
	var i = 0;
	for (var m of d.matchAll(/((?:<[^>]+>)*)([^<]*)/gi)) {
		s += m[1];
		s += m[2].replace(/[a-z]+/gi, (m, o, s) => {
			return '<span class="w" tabindex=' + i++ + '>' + m + '</span>' 
		});
	}
	document.body.innerHTML = s + '<div id="dic"></div><style>\n.w {\n background-color: #fcfcfc;\n}\n#dic { position:fixed; display: block; width: 25%; height: 10%; right: 2%; bottom: 2%; color: #fff; background-color: #232323; padding: 5px; border-radius: 4px; box-shadow: 0 0 6px -1px #a3a3a3; z-index: 999999 }\n:focus { border-style: solid none solid; }\n</style>';

	var d = { the: 'その', a: 'ひとつの', an: 'ひとつの' };
	for (var el of document.getElementsByClassName('w')) {
		el.addEventListener('keydown', (e) => {
			if (e.key == "Tab") return;
			console.log(e);
			console.log(e.key);
			console.log(e.target);
			console.log(e.target.textContent);
			//if ((e.key != 's') || (e.key != 'Enter')) return;
			if (e.key == "a") {
				let p = e.target.parentElement;
				if (p.tagName == 'A') {
					window.open(p.href);
				}
			} else if (e.key == 'q') {
				let f = (e) => { if (e.tagName == 'BODY') { return 0; } else { console.log(e.offsetTop + ':' + e.tagName); return e.offsetTop + f(e.offsetParent); }}
				let renderHeight = window.innerHeight;
				let rh = renderHeight / 2;
				let y = f(e.target) + e.target.offsetHeight / 2 - 1;
				window.scrollTo(0, y - rh);
			}
			if ((e.key != 'w')) return;
			let word = e.target.textContent;
			if (word in d) {
				document.getElementById('dic').textContent = d[word];
			} else {
				document.getElementById('dic').textContent = '';
			}
		}
		);
	}

}
tag();
