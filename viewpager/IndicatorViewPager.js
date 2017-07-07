/**
 * Created by tangzhibin on 16/3/23.
 */

'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, ViewPropTypes} from 'react-native';
import ViewPager from './ViewPager';

const VIEWPAGER_REF = 'viewPager';
const INDICATOR_REF = 'indicator';
export default class IndicatorViewPager extends Component {
    static propTypes = {
        ...ViewPager.propTypes,
        indicator: PropTypes.node,
        pagerStyle: ViewPropTypes.style,
        indicatorPosition: PropTypes.oneOf(['top', 'bottom']),
    };
    static defaultProps = {
        indicator: null,
        initialPage: 0,
        indicatorPosition: 'top',
    };
    constructor(props) {
        super(props);
        this._selectPage = this.props.initialPage;
    }
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                {
                    this.props.indicatorPosition === 'top' ? this._renderIndicator() : null
                }
                <ViewPager
                    {...this.props}
                    ref={VIEWPAGER_REF}
                    style={[styles.pager, this.props.pagerStyle]}
                    onPageScroll={this._onPageScroll.bind(this)}
                    onPageSelected={this._onPageSelected.bind(this)}
                />
                {
                    this.props.indicatorPosition === 'bottom' ? this._renderIndicator() : null
                }
            </View>
        );
    }

    _onPageScroll(params) {
        let indicator = this.refs[INDICATOR_REF];
        indicator && indicator.onPageScroll && indicator.onPageScroll(params);
        this.props.onPageScroll && this.props.onPageScroll(params);
    }

    _onPageSelected(params) {
        let indicator = this.refs[INDICATOR_REF];
        indicator && indicator.onPageSelected && indicator.onPageSelected(params);
        this.props.onPageSelected && this.props.onPageSelected(params);
    }

    _renderIndicator() {
        let {indicator, initialPage}=this.props;
        if (!indicator)return null;
        return React.cloneElement(indicator, {
            ref: INDICATOR_REF,
            pager: this,
            initialPage: initialPage
        });
    }

    setPage(selectedPage) {
        this._selectPage = selectedPage;
        this.refs[VIEWPAGER_REF].setPage(selectedPage);
    }

    setPageWithoutAnimation(selectedPage) {
        this.refs[VIEWPAGER_REF].setPageWithoutAnimation(selectedPage);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initialPage !== this._selectPage && this.props.initialPage !== nextProps.initialPage) {
            this.setPage(nextProps.initialPage);
        }
    }
}
const styles = StyleSheet.create({
    container: {},
    pager: {
        flex: 1
    }
});
