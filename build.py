#!/usr/bin/env python3
"""Monta o jogo: index.html (usa three.min.js local) e jogo-unico.html (Three.js por CDN)."""
from pathlib import Path
R = Path(__file__).parent
js = (R / 'src/base.js').read_text() + (R / 'src/personagens.js').read_text() + (R / 'src/jogo.js').read_text()
pg = (R / 'src/pagina.html').read_text()
(R / 'index.html').write_text(pg.replace('__THREE__', '<script src="three.min.js"></script>').replace('__JOGO__', js))
(R / 'jogo-unico.html').write_text(pg.replace('__THREE__', '<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>').replace('__JOGO__', js))
print('ok', len(js))
