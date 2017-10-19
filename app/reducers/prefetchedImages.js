'use strict';
import img from '../constants/images'
import _ from 'lodash';

const initialState = {
    images: []
};

function prefetchedImages(state = initialState, action = {}) {

    switch(action.type) {

        case img.IMAGE_PREFETCHED:
            if (_.indexOf(state.images, action.imageUrl) == -1) {
                const image = {
                    uri: action.imageUrl,
                    width: action.width,
                    height: action.height
                };
                state.images.push(image);
            }
            return state;

        default:
            return state;
    }

    return state;
}

module.exports = prefetchedImages;