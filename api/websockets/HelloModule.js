function Hello() {
    var name;
    this.setName = function (thyName) {
        name = thyName;
    };
    this.sayHello = function () {
        return 'Hello ' + name;
    };
};

module.exports = Hello