/**
 * Created by lyan2 on 16/11/23.
 */
(function(global) {

    'use strict';

    var fabric  = global.fabric || (global.fabric = { }),
        extend = fabric.util.object.extend;

    /**
     * Brightness filter class
     * @class fabric.Image.filters.Brightness
     * @memberOf fabric.Image.filters
     * @extends fabric.Image.filters.BaseFilter
     * @see {@link fabric.Image.filters.Brightness#initialize} for constructor definition
     * @see {@link http://fabricjs.com/image-filters/|ImageFilters demo}
     * @example
     * var filter = new fabric.Image.filters.Contrast({
   *   contrast: 200
   * });
     * object.filters.push(filter);
     * object.applyFilters(canvas.renderAll.bind(canvas));
     */
    fabric.Image.filters.Contrast = fabric.util.createClass(fabric.Image.filters.BaseFilter, /** @lends fabric.Image.filters.Brightness.prototype */ {

        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: 'Contrast',

        /**
         * Constructor
         * @memberOf fabric.Image.filters.Brightness.prototype
         * @param {Object} [options] Options object
         * @param {Number} [options.contrast=0] Value to brighten the image up (0..2)
         */
        initialize: function(options) {
            options = options || { };
            this.contrast = options.contrast || 0;
        },

        /**
         * Applies filter to canvas element
         * @param {Object} canvasEl Canvas element to apply filter to
         */
        applyTo: function(canvasEl) {
            var context = canvasEl.getContext('2d'),
                imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
                data = imageData.data,
                contrast = this.contrast,
                redSum = 0, greenSum = 0, blueSum = 0,
                redMean = 0, greenMean = 0, blueMean = 0;

            for (var i = 0, len = data.length; i < len; i += 4) {
                redSum += data[i];
                greenSum += data[i + 1];
                blueSum += data[i + 2];
            }

            redMean = redSum * 4 / data.length;
            greenMean = greenSum * 4 / data.length;
            blueMean = blueSum * 4 / data.length;

            for (var i = 0, len = data.length; i < len; i += 4) {
                data[i] = (data[i] - redMean) * contrast + redMean;
                data[i + 1] = (data[i + 1] - greenMean) * contrast + greenMean;
                data[i + 2] = (data[i + 2] - blueMean) * contrast + blueMean;
            }

            context.putImageData(imageData, 0, 0);
        },

        /**
         * Returns object representation of an instance
         * @return {Object} Object representation of an instance
         */
        toObject: function() {
            return extend(this.callSuper('toObject'), {
                contrast: this.contrast
            });
        }
    });

    /**
     * Returns filter instance from an object representation
     * @static
     * @param {Object} object Object to create an instance from
     * @return {fabric.Image.filters.Brightness} Instance of fabric.Image.filters.Brightness
     */
    fabric.Image.filters.Contrast.fromObject = function(object) {
        return new fabric.Image.filters.Contrast(object);
    };

})(typeof exports !== 'undefined' ? exports : this);