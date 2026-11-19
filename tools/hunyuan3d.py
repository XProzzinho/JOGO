# Gera personagens 3D de graça pelo Hugging Face, usando a chave HF_TOKEN guardada nos Secrets do GitHub.
# 1) FLUX.1-schnell desenha o personagem de corpo inteiro (arte conceitual)
# 2) Hunyuan3D-2 transforma essa imagem em modelo 3D com textura (.glb)
import os, sys, json, shutil
from gradio_client import Client, handle_file

prompts = json.loads(os.environ["PROMPTS"])
token = os.environ.get("HF_TOKEN") or None
os.makedirs("saida", exist_ok=True)


def caminho(x):
    if isinstance(x, dict):
        x = x.get("path") or x.get("value")
    return x


flux = Client("black-forest-labs/FLUX.1-schnell", token=token, verbose=False)
hy = None
ok = 0
for i, p in enumerate(prompts):
    n = i + 1
    try:
        img = p.get("imagem")
        if not img:
            r = flux.predict(prompt=p["texto"], seed=p.get("seed", 1234), randomize_seed=False, width=768, height=1024,
                             num_inference_steps=4, api_name="/infer")
            img = caminho(r[0])
            shutil.copy(img, f"saida/arte_{n}.webp" if img.endswith(".webp") else f"saida/arte_{n}.png")
            print(n, "arte pronta:", img)
        if p.get("so_arte"):
            ok += 1
            continue
        if hy is None:
            hy = Client(os.environ.get("ESPACO_3D") or "tencent/Hunyuan3D-2.1", token=token, verbose=False)
        r = hy.predict(image=handle_file(img), steps=30, guidance_scale=5.0, seed=p.get("seed", 1234),
                       octree_resolution=256, check_box_rembg=True, num_chunks=8000, randomize_seed=False,
                       api_name="/generation_all")
        for k, f in enumerate(r[:2]):
            f = caminho(f)
            if f and os.path.exists(f):
                shutil.copy(f, f"saida/modelo_{n}_{'branco' if k == 0 else 'textura'}{os.path.splitext(f)[1] or '.glb'}")
        print(n, "modelo 3D pronto")
        ok += 1
    except Exception as e:
        print(n, "ERRO:", e)
print("gerados:", ok, "de", len(prompts))
sys.exit(0 if ok else 1)
