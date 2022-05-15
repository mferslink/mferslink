import React, {createContext, useReducer, useContext, Dispatch} from 'react';
import type {UserInfo} from '@/typings/user';
import type { DonateInfo } from '@/typings/common';

export const ACTIONS = {
    /**
     * 设置登录态
     */
    SET_WALLET_ADDRESS: 'setWallectAddress',
    /**
     * 设置全局loading状态
     */
    SET_LOADING_STATUS: 'setLoadingStatus',
    /**
     * 设置用户信息
     */
    SET_USER_INFO: 'setUserInfo',

     /**
     * 设置当前路径
     */
    SET_CUR_PATH: 'setCurPath',

     /**
     * 设置是否显示登录框
     */
    SET_SHOW_LOGIN_MODAL: 'setShowLoginModal',

     /**
     * 设置是否为移动端
     */
    SET_IS_WISE: 'setIsWise',

    /**
     * 设置是否显示移动端侧边栏抽屉
     */
    SET_SHOW_SIDEBAR_DRAWER: 'setShowSideBarDrawer',
  
    /**
     * 设置捐赠框信息
     */
    SET_DONATE_MODAL: 'setDonateModal',
};

export interface StoreState {
    walletAddress: string;
    displayLoading: boolean;
    userInfo: UserInfo;
    curPath: string;
    showLoginModal: boolean;
    isWise: boolean;
    showSideBarDrawer: boolean;
    donateModal: DonateInfo
}

type ValueOf<T> = T[keyof T];

export interface StoreAction {
    type: ValueOf<typeof ACTIONS>;
    payload: any;
}

const initialState = {
    walletAddress: '',
    displayLoading: true,
    userInfo: {
        name: '',
        walletAddress: '',
        profileImage: '',
        profileImageRef: '',
        notifications: 0,
        lastNotificationTime: new Date()
    },
    curPath: '/home',
    showLoginModal: false,
    showSideBarDrawer: false,
    isWise: false,
    donateModal: {
        status: 1,
        visible: false
    }
};

function reducer(state: StoreState, action: StoreAction) {
    switch (action.type) {
        case ACTIONS.SET_WALLET_ADDRESS:
            state.walletAddress = action.payload;
            return {
                ...state,
            };
        case ACTIONS.SET_LOADING_STATUS:
            state.displayLoading = action.payload;
            return {
                ...state,
            };
        case ACTIONS.SET_USER_INFO:
            state.userInfo = action.payload;
            return {
                ...state,
            };
        case ACTIONS.SET_CUR_PATH:
            state.curPath = action.payload;
            return {
                ...state,
            };
        case ACTIONS.SET_SHOW_LOGIN_MODAL:
            state.showLoginModal = action.payload;
            return {
                ...state,
            };
        case ACTIONS.SET_IS_WISE:
            state.isWise = action.payload;
            return {
                ...state,
            };
        case ACTIONS.SET_SHOW_SIDEBAR_DRAWER:
            state.showSideBarDrawer = action.payload;
            return {
                ...state,
            };
        case ACTIONS.SET_DONATE_MODAL:
            state.donateModal = action.payload;
            return {
                ...state,
            };
        default:
            console.error(`action type [${action.type}] 未找到`);
            return state;
    }
}

const StateContext = createContext<StoreState>(initialState);
export const DispatchContext = createContext<Dispatch<StoreAction> | null>(null);

function useStateStore() {
    return useContext(StateContext);
}

function useDispatchStore() {
    return useContext(DispatchContext);
}

const StoreProvider = React.memo(({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
});

export {
    useStateStore,
    useDispatchStore,
    StoreProvider,
};