(function($) {
    $.fn.tree = function( options ) {

        var settings = $.extend({
            container: '#categoryTree',
            selectFieldText: 'Alle bzw. hier auswählen',
            stateAttrName: 'data-state',
            className: {
                itemChecked: 'checked',
                itemInactive: 'inactive',
                itemActive: 'active'
            }
        }, options);

        return this.each( function() {
            buildCategoryTree(treeData);

            changeDropdownTitle();

            function changeDropdownTitle() {
                var checkedItemsLength = $(settings.container).find('li[' + settings.stateAttrName + '="' + settings.className.itemChecked + '"]' ).length;

                if( checkedItemsLength == 1 ) {
                    $('.dropdownTitle').text(checkedItemsLength + ' Rubrik ausgewählt');
                } else if( checkedItemsLength > 1 ) {
                    $('.dropdownTitle').text(checkedItemsLength + ' Rubriken ausgewählt');
                } else {
                    $('.dropdownTitle').text(settings.selectFieldText);
                }

            }


            $(settings.container).find('li[' + settings.stateAttrName + '="' + settings.className.itemChecked + '"]' ).each(function() {
                changeStateOfAllChildren($(this), settings.className.itemChecked);
            });


            $(settings.container).find('li .categoryTitle').each(function() {
                $(this).on('click', function(e) {
                    var listItem = $(this ).parent('li');
                    var state = listItem.attr(settings.stateAttrName);
                    if( state == settings.className.itemChecked ) {
                        listItem.attr(settings.stateAttrName, settings.className.itemInactive);
                        changeStateOfAllChildren(listItem, settings.className.itemInactive);
                    } else if( state == settings.className.itemInactive ) {
                        listItem.attr(settings.stateAttrName, settings.className.itemChecked);
                        changeStateOfAllChildren(listItem, settings.className.itemChecked);
                    } else if( state == settings.className.itemActive ) {
                        listItem.attr(settings.stateAttrName, settings.className.itemInactive);
                        changeStateOfAllChildren(listItem, settings.className.itemInactive);
                    }
                    e.stopPropagation();
                });
            });

            $(settings.container).find('li .arrow').each(function() {
                $(this).parent('li').on('click', function(e) {
                    var listItem = $(this);
                    listItem.children('ul').first().slideToggle('slow');
                    listItem.toggleClass('open');
                    listItem.find('.arrow' ).toggleClass('open');
                    listItem.toggleClass('closed');
                    listItem.find('.arrow' ).toggleClass('closed');
                    e.stopPropagation();
                });
            });

            /**
             * Render CategoryTree as nested list
             *
             * @param treeData
             */
            function buildCategoryTree(treeData) {
                var output = '';
                output = renderChildren( output, treeData );
                var mainList = '<ul><li class="closed firstListItem">' +
                               '<span class="dropdownTitle">' + settings.selectFieldText + '</span>' +
                               '<div class="arrow closed"></div>' +
                               output+
                               '</li></ul>';
                $(settings.container).append(mainList);
            }

            /**
             * Render children of category
             *
             * @param string output
             * @param elements
             */
            function renderChildren( output, elements ) {
                output += '<ul>';
                for( var k = 0; k < elements.length; k++ ) {
                    var child = elements[k];
                    var hasChildren = false;
                    var className = '';
                    if( child.children ) {
                        hasChildren = true;
                        if( child.state == settings.className.itemActive ) {
                            className += ' open';
                        } else {
                            className += ' closed';
                        }
                    }
                    output += '<li class="' + className + '" data-category="' + child.id + '" data-parent="' + child.parentUid + '" data-state="' + child.state + '">';
                    output += '<span class="categoryTitle">' + child.title + '</span>';
                    if(hasChildren) {
                        output += '<div class="arrow ' + className + '"></div>';
                    }
                    if( hasChildren ) {
                        output = renderChildren( output, child.children );
                    }
                    output += '</li>';
                }
                output += '</ul>';

                return output;
            }

            /**
             * set state of childListItems to checked
             *
             * @param target
             * @param string state
             */
            function changeStateOfAllChildren(target, state) {
                checkParentItems($(target));
                while( target.children().length ) {
                    target = target.children();
                    target.each(function() {
                        if( $(this)[0].tagName == 'LI' ) {
                            target.attr(settings.stateAttrName, state);
                        }
                    });
                }
                changeDropdownTitle();
            }

            function checkParentItems(item) {
                var parentUid = item.data('parent');
                var parentItem = $('li[data-category="' + parentUid + '"]');
                var activeChildren = false, inactiveChildren = false, checkedChildren = false;

                if( parentItem.length > 0 ) {

                    parentItem.find('li[data-parent="' + parentUid + '"]' ).each(function() {
                        var childState = $(this ).attr(settings.stateAttrName);
                        if( childState == settings.className.itemInactive ) {
                            inactiveChildren = true;
                        } else if( childState == settings.className.itemActive ) {
                            activeChildren = true;
                        } else if( childState == settings.className.itemChecked ) {
                            checkedChildren = true;
                        }
                    });

                    var newParentState = settings.className.itemInactive;
                    if( ( (activeChildren || checkedChildren ) && inactiveChildren ) || activeChildren ) {
                        newParentState = settings.className.itemActive;
                    } else if( checkedChildren && !activeChildren && !inactiveChildren ) {
                        newParentState = settings.className.itemChecked;
                    }
                    parentItem.attr(settings.stateAttrName, newParentState);

                    checkParentItems(parentItem);
                }
            }

            // submit form
            function getCategories() {
                var categoryValues = '';
                var elements = 0;

                $(settings.container).find('li[' + settings.stateAttrName + '="' + settings.className.itemChecked + '"]' ).each(function() {
                    var categoryId = $(this).attr('data-category');
                    categoryValues += categoryId + ',';
                    elements++;
                });

                categoryValues = categoryValues.substr(0, categoryValues.length - 1);
                $('#categorieList').val(categoryValues);
            }

            window.preFilterFormSubmissionMethods.push(function (e) {
                getCategories();
                window.numPreFilterFormSubmissionMethodsFinished++;
            });
        });
    }
}(jQuery));

$(document).ready(function() {
   $('#categoryTree' ).tree();
});