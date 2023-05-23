export function Table (options?: {}) {
    return function(constructor: Function) {
        (constructor as any).init({
            ...constructor.prototype.table_info,
        }, options)
    };
}

export function Column(type, options?: {}) {
    return function(instance, name) {
        if (!instance['table_info']) {
            instance['table_info'] = {}
        }
        instance['table_info'][name] = {
            type,
            ...options
        };
    };
}
