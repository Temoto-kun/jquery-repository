# jquery-template

Simple abstraction for data-bound HTML.

## Installation

NPM:

    $ npm install --save jquery.repository
    
Bower:
    
    $ bower install --save jquery.repository

## Usage

In your HTML file:

```html
/* code here... */

<ul data-repository="foo">
    <li data-repository-item-start>
        Sorted by Name
    </li>
    <li data-repository-item="{&quot;name&quot;:&quot;John Doe&quot;,&quot;email&quot;:&quot;john.doe@example.com&quot;}">
        <strong>John Doe</strong>
        <div>john.doe@example.com</div>
    </li>
    <li data-repository-item="{&quot;name&quot;:&quot;John Doe2&quot;,&quot;email&quot;:&quot;john.doe2@example.com&quot;}">
        <strong>John Doe2</strong>
        <div>john.doe2@example.com</div>
    </li>
    <li data-repository-item-end>
        2 Items
    </li>
    <li>
        <button type="button">Load More</button>
    </li>
</ul>

/* code there... */
```

In your JavaScript files:

```javascript
var Component = function Component(user) {
    var _this = $('<li>'), $name, $email;
    
    $name = $('<strong>')
        .text(user.name);
        
    $email = $('<div>')
        .text(user.email);
        
    _this
        .append($name)
        .append($email);
        
    return _this;
};

var repository = $.Repository('foo', Component);

repository
    .add([
        {
            name: "John Doe3",
            email: "john.doe3@example.com"
        },
        {
            name: "John Doe4",
            email: "john.doe4@example.com"
        }
    ]);
```

## License

MIT. See LICENSE file for details.
