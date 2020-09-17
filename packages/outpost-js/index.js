"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitState = exports.ROLES = exports.DEV_CONTRACT_ID = exports.PROD_CONTRACT_ID = exports.CONTRACT_SRC = void 0;
exports.CONTRACT_SRC = 'a3vdjXrmSyF6zrSOO-ddeXuGuWpJ-3SCfOWkh9ms4cY';
exports.PROD_CONTRACT_ID = 'BXCEBKTv-Fvan0m82aEi7njdnRsFDluFkfN8vrWG5FI';
exports.DEV_CONTRACT_ID = 'tynArDso6PKe7h1uRfu8jS7XHhTYRJQhqVRExAi0bqU';
exports.ROLES = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    MODERATOR: 'MODERATOR',
    MEMBER: 'MEMBER'
};
function createInitState(did, name, isOpen) {
    const initState = {
        name,
        isOpen,
        guidelines: null,
        owner: did,
        admins: {},
        moderators: {},
        members: {},
        children: {},
        timestamps: {}
    };
    initState.admins[did] = true;
    initState.moderators[did] = true;
    initState.members[did] = true;
    return initState;
}
exports.createInitState = createInitState;
//# sourceMappingURL=index.js.map