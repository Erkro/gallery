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
            }
        }
    };

g.init();
