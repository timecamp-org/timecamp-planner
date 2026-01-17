export default function* takeFirst(pattern, saga, ...args) {
    const task = yield fork(function* () {
        while (true) {
            const action = yield take(pattern);
            yield call(saga, ...args.concat(action));
        }
    });
    return task;
}