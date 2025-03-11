module.exports = {
    build: ['sh:build'],
    test: ['build', 'sh:test-unit']
};
