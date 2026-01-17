
export default {
    effectTriggered: (options) => {
        const { effectId, parentEffectId, label, effect } = options;

        console.log(`Effect Triggered: `, options);
    },
    effectResolved: (effectId, result) => {
        console.log(`Effect Resolved: `, effectId, result);
    },
    effectRejected: (effectId, error) => {
        console.log(`Effect Rejected: `, effectId, error);
    },
    effectCancelled: (effectId) => {
        console.log(`Effect Cancelled: `, effectId);
    },
    actionDispatched: (action) => {
        console.log(`Action Dispatched: `, action);
    }
}