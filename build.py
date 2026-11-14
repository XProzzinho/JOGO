#!/usr/bin/env python3
"""Monta o jogo: index.html (usa three.min.js local) e jogo-unico.html (Three.js por CDN)."""
from pathlib import Path
R = Path(__file__).parent
js = (R / 'src/base.js').read_text() + (R / 'src/personagens.js').read_text() + (R / 'src/jogo.js').read_text().replace('  //@@HABILIDADES@@', (R / 'src/habilidades.js').read_text()).replace('  //@@GM@@', (R / 'src/gm.js').read_text()).replace('  //@@MUNDO@@', (R / 'src/mundo.js').read_text()).replace('  //@@CALAB@@', (R / 'src/calabouco.js').read_text() + (R / 'src/divinos3d.js').read_text() + (R / 'src/leilao.js').read_text() + (R / 'src/aros.js').read_text() + (R / 'src/pilares.js').read_text() + (R / 'src/asas_abismo.js').read_text() + (R / 'src/gelo.js').read_text() + (R / 'src/nacao.js').read_text() + (R / 'src/nacao_sim.js').read_text() + (R / 'src/historia.js').read_text() + (R / 'src/lendarias.js').read_text() + (R / 'src/arvore.js').read_text()).replace('  //@@GUILDA@@', (R / 'src/guilda.js').read_text()).replace('  //@@ESPADAS@@', (R / 'src/espadas.js').read_text())
pg = (R / 'src/pagina.html').read_text()
conta = (R / 'src/firebase-config.js').read_text() + '\n' + (R / 'src/conta.js').read_text()
FB = ['firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js']
def fb(base): return ''.join(f'<script src="{base}{f}"></script>' for f in FB)
pg = pg.replace('__CONTA__', conta)
(R / 'index.html').write_text(pg.replace('__FIREBASE__', fb('firebase/')).replace('__THREE__', '<script src="three.min.js"></script>').replace('__JOGO__', js))
(R / 'jogo-unico.html').write_text(pg.replace('__FIREBASE__', fb('https://cdn.jsdelivr.net/npm/firebase@10.12.2/')).replace('__THREE__', '<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>').replace('__JOGO__', js))
print('ok', len(js))
