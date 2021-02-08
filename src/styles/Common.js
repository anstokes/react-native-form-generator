import React from 'react';
import {StyleSheet} from 'react-native';

const commonStyles = StyleSheet.create({
    dFlexRow: {
        display: 'flex',
        flexDirection: 'row',
    },

    dFlexColumn: {
        display: 'flex',
        flexDirection: 'column',
    },

    dFlex1: {
        flex: 1,
    },

    justifyContentCenter: {
        justifyContent: 'center',
    },

    justifyContentEvenly: {
        justifyContent: 'space-evenly',
    },

    justifyContentBetween: {
      justifyContent: 'space-between',
    },

    alignItemsCenter: {
        alignItems: 'center'
    },

    alignItemsStart: {
        alignItems: 'flex-start'
    },

    marginTop05: {
        marginTop: 8
    },

    marginTop1: {
        marginTop: 16
    },

    marginRight05: {
        marginRight: 8,
    },

    marginRight1: {
        marginRight: 16,
    },

    marginBottom05: {
        marginBottom: 8,
    },

    marginBottom1: {
        marginBottom: 16,
    },

    margin05: {
        margin: 8
    },

    margin1: {
        margin: 16
    },

    marginV05: {
        marginTop: 8,
        marginBottom: 8,
    },

    marginV1: {
        marginTop: 16,
        marginBottom: 8,
    },

    padding05: {
        padding: 8
    },

    padding1: {
        padding: 16
    },

    paddingH0: {
        paddingHorizontal: 0,
    },

    paddingH05: {
        paddingHorizontal: 8,
    },

    paddingH1: {
        paddingHorizontal: 16,
    },

    paddingV0: {
        paddingVertical: 0
    },

    paddingV05: {
        paddingTop: 8,
        paddingBottom: 8,
    },

    paddingV1: {
        paddingTop: 16,
        paddingBottom: 16,
    },

    borderRight1: {
        borderRightWidth: 1,
        borderRightColor: '#5f5f5f'
    },

    borderBottom1: {
        borderBottomWidth: 1,
        borderBottomColor: '#5f5f5f'
    },

    columnContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 8,
    },

    // columnContainerScroll: {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     padding: 8,
    //     height: '100%',
    // },
})

export default commonStyles;