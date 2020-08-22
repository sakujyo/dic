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
	for (var m of d.matchAll(/((?:<[^>]+>)*)([^<]*)/gi)) {
		s += m[1];
		s += m[2].replace(/[a-z]+/gi, (m, o, s) => {
			return '<span class="w">' + m + '</span>' 
		});
	}
	document.body.innerHTML = s + '<div id="dic"></div><style>\n.w {\n  color: #777;\n}\n#dic { position:fixed; display: block; width: 25%; height: 10%; left:75%; top: 90%; color: #fff; background-color: #232323; }</style>';

	var d = { word: '単語', };
	for (var el of document.getElementsByClassName('w')) {
		el.addEventListener('click', (e) => {
			console.log(e);
			console.log(e.target.textContent);
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
