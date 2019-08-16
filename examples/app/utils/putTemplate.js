export default function (module) {
    return (name, template) => {
        module.run(['$templateCache', function ($templateCache) {
            $templateCache.put(`templates/${name}`, template);
        }]);
    };
}
