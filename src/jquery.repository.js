/**
 * @author Temoto-kun <kiiroifuriku@hotmail.com>
 * Written: 16-06-13 10:14
 */

(function (jQuery) {
    var _repositories;

    if (!jQuery){
        throw new Error('jquery.repository requires jQuery');
    }

    /**
     * A collection for storing data.
     *
     * @param {String} name The name which this Repository shall be referred.
     * @param {Object} Component Component where the items shall be bound to.
     * @param {Object} options Options for this Repository.
     * @returns {Repository}
     * @constructor
     */
    jQuery.Repository = function Repository(name, Component, options){
        var _this = {},
            _els = jQuery('[data-repository="' + name +'"]'),
            _components;

        /**
         * Visually adds items into the element bound with the Repository.
         *
         * @param {Array} items The array of items to add.
         * @private
         */
        function _visualAdd(items) {
            _els.each(function (i, el){
                var _el = jQuery(el),
                    _children = _el.children(),
                    _itemStart = _children.filter('[data-repository-item-start]'),
                    _itemEnd = _children.filter('[data-repository-item-end]');

                items.forEach(function (item){
                    _components[i][item.id] = new Component(item, options.childComponentOptions)
                        .attr('data-repository-item', JSON.stringify(item));

                    if (_itemEnd.length < 1){
                        if (_itemStart.length < 1) {
                            _el.append(_components[i][item.id]);
                            return;
                        }
                        _components[i][item.id].insertAfter(_itemStart);
                        return;
                    }

                    _components[i][item.id].insertBefore(_itemEnd);
                });
            });
        }

        /**
         * Visually clears the items of the element bound with the Repository.
         *
         * @private
         */
        function _visualClear(){
            _els.each(function (i, el){
                jQuery(el)
                    .children()
                    .filter('[data-repository-item]')
                    .remove();

                _components[i] = [];
            });
        }

        /**
         * Visually updates the element bound with the Repository.
         *
         * @private
         */
        function _visualUpdate(){
            _visualClear();
            _visualAdd(_repositories[name]);
        }

        /**
         * Visually removes the items with the specified IDs from the element bound with the Repository.
         *
         * @param {Array} ids The array of item IDs.
         * @private
         */
        function _visualRemove(ids){
            _els.each(function (i, el){
                var _el = jQuery(el),
                    _children = _el.children('[data-repository-item]');

                ids.forEach(function (id){
                    _children.each(function (j, child){
                        var _child = jQuery(child),
                            _data = _child.data('repositoryItem');

                        if (_data.id === id){
                            _child.remove();
                            delete _components[i][id];
                        }
                    });
                });
            });
        }

        /**
         * Adds items to the Repository.
         *
         * @param {Array} items The items to add.
         * @returns {Repository} This Repository instance.
         * @private
         */
        function _add(items){
            if (!(items instanceof Array)){
                items = [items];
            }

            _repositories[name] = _repositories[name].concat(items);

            _visualAdd(items);

            return _this;
        }

        /**
         * Initializes the singleton instance of the Repository data.
         *
         * @private
         */
        function _initializeData(){
            _repositories = _repositories || {};
            _repositories[name] = _repositories[name] || [];
        }

        /**
         * Initializes the component storage of the Repository.
         *
         * @private
         */
        function _initializeComponents(){
            _components = _components || [];
            _els.each(function (i){
                _components[i] = _components[i] || [];
            });
        }

        /**
         * Initializes the options for this Repository.
         *
         * @private
         */
        function _initializeOptions(){
            options.selectedClassName = options.selectedClassName || 'active';
            options.childComponentOptions = options.childComponentOptions || {};
        }

        /**
         * Adds the items defined from the markup.
         *
         * @private
         */
        function _addExistingItems(){
            _els
                .children('[data-repository-item]')
                .each(function (j, item){
                    _add(jQuery(item).data('repositoryItem'));
                })
                .remove();

            _visualUpdate();
        }

        function _initializeRepository(options){
            _initializeOptions(options);
            _initializeComponents();
            _initializeData();
            _addExistingItems();

            return _this;
        }

        /**
         * Returns the index of the item with the specified ID from the Repository, else returns -1 if not found.
         * @param {*} id The ID of the item.
         * @returns {number} The index of the item with the specified ID.
         * @private
         */
        function _indexOf(id){
            var index = -1;

            _repositories[name].forEach(function (account, i){
                if (account.id !== id){
                    return;
                }

                index = i;
            });

            return index;
        }

        /**
         * Gets all the items from the Repository.
         *
         * @returns {Array}
         * @private
         */
        function _getAll(){
            return _repositories[name];
        }

        /**
         * Gets the component of the item with the specified ID from the element bound with the Repository.
         * @param {*} id The ID of the item to extract the component from.
         * @returns {*} The component object, or null if the item is not found.
         * @private
         */
        function _getComponent(id){
            return _components[0][id]; // TODO get the references of components
            //var components = [];
            //
            //_components.forEach(function (c){
            //    components.push(c[id]);
            //});
            //
            //return jQuery(components);
        }

        /**
         * Removes items from the Repository.
         * @param ids
         * @returns {{}}
         * @private
         */
        function _remove(ids){
            if (!(ids instanceof Array)){
                ids = [ids];
            }

            ids.forEach(function (id){
                var index = _indexOf(id);

                if (index < 0){
                    return;
                }

                _repositories[name].splice(index, 1);
            });

            _visualRemove(ids);

            return _this;
        }

        /**
         * Updates the Repository.
         *
         * @private
         */
        function _update(){
            _visualUpdate();
        }

        _this.add = _add;
        _this.update = _update;
        _this.indexOf = _indexOf;
        _this.remove = _remove;
        _this.getComponent = _getComponent;
        _this.getAll = _getAll;

        return _initializeRepository(options);
    };
})(window.jQuery);
