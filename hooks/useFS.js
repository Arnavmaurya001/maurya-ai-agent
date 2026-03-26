const { useState, useEffect } = React;

export const useFS = () => {
    const [fileSystem, setFileSystem] = useState(() => {
        const saved = localStorage.getItem('virtual_fs');
        return saved ? JSON.parse(saved) : {
            'app.js': '// Welcome to the mock filesystem\nconsole.log("Hello, Agent!");',
            'readme.md': '# Project Documentation\nStart by building something great.'
        };
    });

    useEffect(() => {
        localStorage.setItem('virtual_fs', JSON.stringify(fileSystem));
    }, [fileSystem]);

    return { fileSystem, setFileSystem };
};
