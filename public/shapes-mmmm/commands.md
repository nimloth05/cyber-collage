Remove _vox in name:

    rename 's/_vox//' *.*

Anhand des Namens directory erzeugen:
    
    ls ./*.obj | sed 's/.obj//' | xargs -L 1 mkdir


