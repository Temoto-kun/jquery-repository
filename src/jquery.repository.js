/**
 * @author Temoto-kun <kiiroifuriku@hotmail.com>
 * Written: 16-06-13 10:14
 */

(function () {
    var _this = {},
        _options,
        _els,
        _name,
        _Component;

    /**
     * Visually adds items into the element bound with the Repository.
     *
     * @param {Array} items The array of items to add.
     * @private
     */
    function _visualAdd(items) {
        _els.each(function (i, el){
            var _el = $(el),
                _children = _el.children(),
                _itemStart = _children.filter('[data-repository-item-start]'),
                _itemEnd = _children.filter('[data-repository-item-end]');

            items.forEach(function (item){
                var _newItem = new _Component(item)
                    .attr('data-repository-item', JSON.stringify(item));

                if (_itemEnd.length < 1){
                    if (_itemStart.length < 1) {
                        _el.append(_newItem);
                        return;
                    }
                    _newItem.insertAfter(_itemStart);
                    return;
                }

                _newItem.insertBefore(_itemEnd);
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
            $(el)
                .children()
                .filter('[data-repository-item]')
                .remove();
        });
    }

    /**
     * Visually updates the element bound with the Repository.
     *
     * @private
     */
    function _visualUpdate(){
        _visualClear();
        _visualAdd(window._repositories[_name]);
    }

    /**
     * Visually removes the items with the specified IDs from the element bound with the Repository.
     *
     * @param {Array} ids The array of item IDs.
     * @private
     */
    function _visualRemove(ids){
        _els.each(function (i, el){
            var _el = $(el),
                _children = _el.children('[data-repository-item]');

            ids.forEach(function (id){
                _children.each(function (i, child){
                    var _child = $(child),
                        _data = _child.data('repositoryItem');

                    if (_data.id === id){
                        _child.remove();
                    }
                });
            });
        });
    }

    /**
     * Visually sets the selected value of items with the specified IDs from the element bound with the Repository.
     *
     * @param {Array} ids The array of item IDs to select.
     * @param {Boolean} value The value if items should be selected.
     * @private
     */
    function _visualSelect(ids, value){
        _els.each(function (i, el){
            var _el = $(el),
                _children = _el.children('[data-repository-item]');

            ids.forEach(function (id){
                _children.each(function (i, child){
                    var _child = $(child),
                        _data = _child.data('repositoryItem');

                    if (_data.id === id){
                        if (value) {
                            _child.addClass(_options.selectedClassName);
                            return;
                        }
                        _child.removeClass(_options.selectedClassName);
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

        window._repositories[_name] = window._repositories[_name].concat(items);

        _visualAdd(items);

        return _this;
    }

    /**
     * Initializes the singleton instance of the Repository data.
     *
     * @private
     */
    function _initializeData(){
        window._repositories[_name] = window._repositories[_name] || [];
    }

    /**
     * Initializes the options for this Repository.
     *
     * @private
     */
    function _initializeOptions(){
        _options.selectedClassName = _options.selectedClassName || 'active';
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
                _add($(item).data('repositoryItem'));
            });
    }

    /**
     * Method for initializing this Repository.
     *
     * @param {String} name The name which this Repository shall be referred.
     * @param {Object} childComponent Component where the items shall be bound to.
     * @param {Object} options Options for this Repository.
     * @returns {Repository} This Repository instance.
     * @private
     */
    function _construct(name, childComponent, options){
        _name = name;
        _Component = childComponent;
        _els = $('[data-repository="' + _name +'"]');
        _options = options || {};

        _initializeOptions(options);
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

        window._repositories[_name].forEach(function (account, i){
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
        return window._repositories[_name];
    }

    /**
     * Sets the selected value of items from the Repository.
     * @param {Array} ids The IDs of the items to select.
     * @param {*} value The selected value of the items.
     * @returns {Repository} This Repository instance.
     * @private
     */
    function _select(ids, value){
        if (!(ids instanceof Array)){
            ids = [ids];
        }

        ids.forEach(function (id){
            var index = indexOf(id);

            if (index < 0){
                return;
            }

            window._repositories[_name][index].selected = value;
        });

        _visualSelect(ids, value);

        return _this;
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
            var index = indexOf(id);

            if (index < 0){
                return;
            }

            window._repositories[_name].splice(index, 1);
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
    _this.select = _select;
    _this.getAll = _getAll;

    /**
     * A collection for storing data.
     *
     * @param {String} name The name which this Repository shall be referred.
     * @param {Object} childComponent Component where the items shall be bound to.
     * @param {Object} options Options for this Repository.
     * @returns {Repository}
     * @constructor
     */
    $.fn.Repository = function Repository(name, childComponent, options){
        return _construct(name, childComponent, options);
    };
})();
