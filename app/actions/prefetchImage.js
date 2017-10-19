'use strict';

import img from '../constants/images';


function prefetchImage(imageUrl,width, height) {
    return {
        type: img.IMAGE_PREFETCHED,
        imageUrl,
        width,
        height
    };
}

export default prefetchImage;