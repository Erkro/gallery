var
    domUtils = {
        domManupulation : {
            getAll: function (selector) {
                return document.querySelectorAll(selector);
            },
            addPrototypes: (function () {

                var addFind = function (selector) {
                    var result;

                    if (!this) {
                        return null;
                    }

                    if (this.length) {
                        this.forEach(function (node) {
                            var selected = node.querySelectorAll(selector);
                            if (selected && selected.length > 0) {
                                if (result) {
                                    result.concat(selected);
                                } else {
                                    result = selected;
                                }
                            }
                        });
                    } else {
                        result = this.querySelectorAll(selector);
                    }

                    return result ? result : null;
                };
                NodeList.prototype.find = addFind;
                HTMLElement.prototype.find = addFind;
            })()
        },
        getInstance: function () {
            return this.domManupulation.getAll;
        }
    },
    g = {
        init: function() {
            var
                $$ = domUtils.getInstance(),
                galleryList = $$('div[data-module-type="gallery"]');

            for(var i=0; i<galleryList.length; i++) {
                var
                    content             = galleryList[i].find('div[data-module-section="content"]'),
                    wrapper             = content.find('div.wrapper'),
                    imageList           = content.find('img'),
                    infoSection         = galleryList[i].find('.info');

                galleryList[i].currentImage = 0;

                imageList[0].className += 'show';
                infoSection[0].innerHTML = '<span>' + (galleryList[i].currentImage+1) + '/' + imageList.length + '</span>';

                this.eventHandler(galleryList[i]);
            }
        },
        showNextImage : function (gallery, next) {
            var
                newCurrentImage,
                imageList     = gallery.find('div[data-module-section="content"] img'),
                infoSection   = gallery.find('.info');

            if(gallery.currentImage+next < 0) {
                newCurrentImage = imageList.length-1;
            } else if(gallery.currentImage+next > imageList.length-1) {
                newCurrentImage = 0
            } else {
                newCurrentImage = gallery.currentImage+next;
            }

            imageList[gallery.currentImage].className = imageList[gallery.currentImage].className.replace(/show/g, '');
            imageList[newCurrentImage].className += " show";
            infoSection[0].innerHTML = '<span>' + (newCurrentImage+1) + '/' + imageList.length + '</span>';
            gallery.currentImage = newCurrentImage;
        },
        eventHandler : function(gallery) {
            this.clickHandler(gallery);
            this.touchHandler(gallery);
        },
        clickHandler : function(gallery) {
            var
                prevButton   = gallery.find('.prev'),
                nextButton   = gallery.find('.next');

            if(!prevButton || !nextButton) {
                return;
            }

            prevButton[0].addEventListener("click", function(event){
                event.stopPropagation();
                event.preventDefault();
                g.showNextImage(gallery, -1);
            }, false);

            nextButton[0].addEventListener("click", function(event){
                event.stopPropagation();
                event.preventDefault();
                g.showNextImage(gallery, 1);
            }, false);
        },
        touchHandler : function(gallery) {
            var
                posX = null,
                posY = null,
                wrapper = gallery.find('div.wrapper');

            function handleTouchStart(event) {
                posX = event.touches[0].clientX;
                posY = event.touches[0].clientY;
            }

            function handleTouchMove(event) {
                if (!posX || !posY) {
                    return;
                }

                var
                    xEnd   = event.touches[0].clientX,
                    yEnd   = event.touches[0].clientY,
                    deltaX = posX - xEnd,
                    deltaY = posY - yEnd;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0) {
                        g.showNextImage(gallery, -1)
                    } else {
                        g.showNextImage(gallery, 1)
                    }
                }

                posX = null;
                posY = null;
            }
            wrapper[0].addEventListener('touchstart', handleTouchStart, false);
            wrapper[0].addEventListener('touchmove', handleTouchMove, false);
        }
    };

g.init();
