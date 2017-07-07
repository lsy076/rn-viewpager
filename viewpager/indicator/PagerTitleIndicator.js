/**
 * Created by tangzhibin on 16/2/28.
 */

'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, ViewPropTypes} from 'react-native';
import IndicatorViewPager from '../IndicatorViewPager';

export default class PagerTitleIndicator extends Component {
    static propTypes = {
        ...ViewPropTypes,
        initialPage: PropTypes.number,
        pager: PropTypes.instanceOf(IndicatorViewPager),
        titles: PropTypes.arrayOf(PropTypes.string).isRequired,
        itemStyle: ViewPropTypes.style,
        itemTextStyle: Text.propTypes.style,
        selectedItemTextStyle: Text.propTypes.style,
        selectedBorderStyle: ViewPropTypes.style,
        containerType: PropTypes.oneOf(['view', 'scrollview']),
    };

    static defaultProps = {
        titles: [],
        initialPage: 0,
        containerType: 'view',
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: this.props.initialPage,
            containerWidth: Dimensions.get('window').width,
        };
        for (let i = 0; i < this.props.titles.length; i++) {
            this.state[i] = 100;
        }
        this._screenStart = 0;
    }

    componentDidMount() {
        this._isMount = true;
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    componentWillReceiveProps(nextProps) {
        // 超出屏幕时候自动滑动
        if (nextProps.containerType === 'scrollview' && nextProps.initialPage !== this.props.initialPage && this.refs.scrollview) {
            let tabStart = 0;
            let scrollToX = -1;
            for (let i = 0; i < nextProps.initialPage; i++) {
                tabStart = tabStart + this.state[i];
            }
            const _screenEnd = this._screenStart + this.state.containerWidth;
            if (tabStart > this._screenStart && tabStart < _screenEnd &&
             tabStart + this.state[nextProps.initialPage] > _screenEnd) {
                scrollToX = this._screenStart + tabStart + this.state[nextProps.initialPage] - _screenEnd;
                if (nextProps.initialPage + 1 < nextProps.titles.length) {
                    scrollToX = scrollToX + this.state[nextProps.initialPage + 1] / 2;
                }
            } else if (tabStart <= this._screenStart) {
                scrollToX = Math.max(tabStart - this.state[nextProps.initialPage] / 2, 0);
            } else if (tabStart >= _screenEnd) {
                scrollToX = tabStart - _screenEnd + this.state[nextProps.initialPage];
                if (nextProps.initialPage + 1 < nextProps.titles.length) {
                    scrollToX = scrollToX + this.state[nextProps.initialPage + 1] / 2;
                }
            }
            if (scrollToX >= 0) {
                this.refs.scrollview.scrollTo({x: scrollToX, animated: true});
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.selectedIndex != nextState.selectedIndex ||
            this.props.titles + '' != nextProps.titles + '' ||
            this.props.style != nextProps.style ||
            this.props.itemStyle != nextProps.itemStyle ||
            this.props.itemTextStyle != nextProps.itemTextStyle ||
            this.props.selectedItemTextStyle != nextProps.selectedItemTextStyle ||
            this.props.selectedBorderStyle != nextProps.selectedBorderStyle;
    }

    render() {
        let {titles, pager, itemStyle, itemTextStyle, selectedItemTextStyle, selectedBorderStyle} = this.props;
        if (!titles || titles.length === 0)return null;

        let titleViews = titles.map((title, index)=> {
            let isSelected = this.state.selectedIndex === index;
            return (
                <TouchableOpacity
                    style={[styles.titleContainer, itemStyle]}
                    activeOpacity={0.6}
                    key={index}
                    onPress={()=> {
                        !isSelected && pager.setPage(index)
                    }}
                    onLayout={(evt) => {
                        const state = {};
                        state[index] = evt.nativeEvent.layout.width;
                        this._isMount && this.setState(state);
                    }}
                >
                    <Text
                        style={isSelected ? [styles.titleTextSelected, selectedItemTextStyle] : [styles.titleText, itemTextStyle]}
                    >
                        {title}
                    </Text>
                    {isSelected && <View style={[styles.selectedBorder, selectedBorderStyle]}/> }
                </TouchableOpacity>
            );
        });

        return (
            <View
                style={[styles.indicatorContainer, this.props.style]}
                onLayout={(evt) => this._isMount && this.setState({ containerWidth: evt.nativeEvent.layout.width })}
            >
                {
                    this.props.containerType === 'scrollview' ? (
                        <ScrollView
                            ref="scrollview"
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            onScroll={(evt) => this._screenStart = evt.nativeEvent.contentOffset.x}
                            scrollEventThrottle={16}
                            bounces={false}
                        >
                            {titleViews}
                        </ScrollView>
                    ) : titleViews
                }
            </View>
        );
    }

    onPageSelected(e) {
        this.setState({selectedIndex: e.position});
    }
}

const styles = StyleSheet.create({
    indicatorContainer: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#F6F6F6'
    },
    titleText: {
        color: '#333333',
        fontSize: 15
    },
    titleTextSelected: {
        color: '#FF7200',
        fontSize: 15
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedBorder: {
        backgroundColor: '#FF7200',
        height: 2,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }
});