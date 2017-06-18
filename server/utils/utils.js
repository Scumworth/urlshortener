const strictTest = (url) => {
    const leader = url.split(':')[0];
    const sections = url.split('.').length;
    if (sections > 1) {
        if (leader === 'http' || leader === 'https') {
            return true;
        }
    }
    else {
        return false;
    }
}

module.exports.strictTest = strictTest;
