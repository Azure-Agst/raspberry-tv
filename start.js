	var images = files.filter(word => word.endsWith(".jpeg")||word.endsWith(".jpg")||word.endsWith(".png")); var il2 = "";
	for (i=0; i<images.length; i++) {
		il2 += "<img src='./images/"+images[i]+"'>;
	}
    return res.render('page2', {images: il2});