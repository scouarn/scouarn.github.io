from shutil import copyfile
from os import listdir
from os.path import isfile, isdir, join
from json import dumps


copyfile("manifest.json", "manifest_bak.json")

with open("manifest.json","w") as file :

    manifest = {}
    for cat in [f for f in listdir("./") if isdir(join("./", f))] :
        manifest[cat] = {"folder":cat,"files": [f for f in listdir("./"+cat) if isfile(join("./"+cat, f))]}

    json = dumps(manifest, indent = 4)
    file.write(json)
