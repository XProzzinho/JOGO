# Gera modelos 3D no Hunyuan3D-2 (Hugging Face) usando a chave HF_TOKEN guardada nos Secrets do GitHub.
import os, sys, json, shutil
from gradio_client import Client
prompts = json.loads(os.environ["PROMPTS"])
os.makedirs("saida", exist_ok=True)
c = Client("tencent/Hunyuan3D-2", token=os.environ.get("HF_TOKEN") or None, verbose=False)
ok = 0
for i, p in enumerate(prompts):
    try:
        r = c.predict(caption=p.get("texto"), steps=30, guidance_scale=5.0, seed=p.get("seed", 1234), octree_resolution=256,
                      check_box_rembg=True, num_chunks=8000, randomize_seed=False, api_name="/generation_all")
        print(i, "resultado:", r[0], r[1], r[3] if len(r) > 3 else "")
        for k, f in enumerate(r[:2]):
            if isinstance(f, dict): f = f.get("value") or f.get("path")
            if f and os.path.exists(f):
                ext = os.path.splitext(f)[1] or ".glb"
                shutil.copy(f, f"saida/modelo_{i+1}_{'branco' if k == 0 else 'textura'}{ext}")
        ok += 1
    except Exception as e:
        print(i, "ERRO:", e)
print("gerados:", ok, "de", len(prompts))
sys.exit(0 if ok else 1)
