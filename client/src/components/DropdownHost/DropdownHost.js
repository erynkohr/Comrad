import React, { Component } from 'react';
import classnames from 'classnames';
import Downshift from 'downshift';
import { connect } from 'react-redux';

import { userAlertClose, userClear, userSearchHosts } from '../../redux/user';
import FormHostAdd from '../FormHostAdd';
import Input from '../Input';
import Modal from '../Modal';

const ADD_NEW_HOST = 'add_new_host';

class DropdownHost extends Component {
  constructor(props) {
    super(props);

    const { filterByStatus = 'All', host, userSearchHosts } = this.props;
    const hostDisplayName = host != null ? this.formatHostName(host) : '';

    //run a host search on the existing value so that the host list is populated with information
    if (hostDisplayName.length > 0) {
      userSearchHosts({ filter: filterByStatus, q: hostDisplayName });
    }

    this.state = {
      cachedSearches: {},
      currentInputValue: hostDisplayName,
      haveSelectedTextOnClick: false,
      hostSearchTimeout: null,
      hasFocus: false,
      selectedHost: host ? { _id: host.id, value: hostDisplayName } : null,
      showAddHostModal: false,
    };
  }

  componentDidUpdate() {
    const { user } = this.props;
    const { cachedSearches } = this.state;
    const { docs, search } = user;

    // cache the search query in state
    if (
      search != null &&
      search.q != null &&
      !(search.q.toLowerCase() in cachedSearches)
    ) {
      cachedSearches[search.q.toLowerCase()] = docs;
      this.setState({ cachedSearches: cachedSearches });
    }
  }

  componentWillUnmount() {
    const { userClear } = this.props;
    userClear();
  }

  formatHostName = user => {
    const { profile, station = { on_air_name: null } } = user;
    const { first_name, last_name } = profile;
    const { on_air_name } = station;
    return on_air_name != null && on_air_name.length > 0
      ? on_air_name
      : `${first_name} ${last_name}`;
  };

  handleChange = e => {
    const { userSearchHosts, filterByStatus = 'All' } = this.props;
    const { cachedSearches, hostSearchTimeout } = this.state;
    const { value } = e.target;

    if (!value) {
      return;
    }

    if (!(value.toLowerCase() in cachedSearches)) {
      //throttle the hostSearch function so we are not calling it rapidly if users are quickly deleting or typing text
      if (hostSearchTimeout != null) {
        clearTimeout(hostSearchTimeout);
      }
      this.setState({
        hostSearchTimeout: setTimeout(
          () => userSearchHosts({ filter: filterByStatus, q: value }),
          150,
        ),
      });
    }

    this.setState({ currentInputValue: value });
  };

  handleBlur = e => {
    const { selectedHost, showAddHostModal } = this.state;

    if (showAddHostModal) {
      return;
    }

    this.setState({
      currentInputValue: selectedHost != null ? selectedHost.value : '',
      hasFocus: false,
      haveSelectedTextOnClick: false,
    });
  };

  handleFocus = () => {
    this.setState({ hasFocus: true });
  };

  handleInputClick = e => {
    //select all text when clicking into the field for the first time
    if (!this.state.haveSelectedTextOnClick) {
      e.target.setSelectionRange(0, e.target.value.length);
      this.setState({ haveSelectedTextOnClick: true });
    }
  };

  handleFormHostAddCancel = () => {
    this.setState({ showAddHostModal: false });
    this.props.userAlertClose();
  };

  handleFormHostAddSubmit = user => {
    this.setState({ showAddHostModal: false });
    this.onSelect({
      _id: user._id,
      value: this.formatHostName(user),
    });
  };

  onSelect = (selection, stateAndHelpers) => {
    const { input, onHostSelect } = this.props;

    if (selection === null) {
      return;
    }

    if (selection === ADD_NEW_HOST) {
      this.setState({
        showAddHostModal: true,
      });
      stateAndHelpers.clearSelection(); // clear the Downshift selection so that we can click the "add new host" button again
      return;
    }

    //if "No Host" was selected, give the selection a display text of an empty string
    if (selection._id == null) {
      selection.value = '';
    }

    if (input != null && input.onChange) {
      //redux form onChange handler
      input.onChange(selection._id);
    }

    if (typeof onHostSelect == 'function') {
      onHostSelect(selection);
    }

    this.setState(
      {
        currentInputValue: selection != null ? selection.value : '',
        selectedHost: selection || null,
      },
      function() {
        document.activeElement.blur(); //remove focus from the Host text field
      },
    );
  };

  renderHostListItem = (item, loading) => {
    const { value } = item;

    if (item !== ADD_NEW_HOST) {
      return <div key={value._id}>{`${value}`}</div>;
    }
    //Add new user component
    return <div key={value}>Add New Host</div>;
  };

  dirtyOverride = currentInputValue => {
    return currentInputValue ? true : false;
  };

  render() {
    const {
      addHostFormDisplayed,
      dirtyOverride,
      handleChange,
      handleFocus,
      handleFormHostAddCancel,
      handleFormHostAddSubmit,
      handleInputClick,
      handleBlur,
      formatHostName,
      initialValue,
      onSelect,
      props,
      renderHostListItem,
      state,
    } = this;
    const { auth, user } = props;
    const {
      cachedSearches,
      currentInputValue,
      hasFocus,
      showAddHostModal,
    } = state;
    const { loading } = user;

    // get the documents from the cachedResults property rather than Redux,
    // because Redux might not have the search results of the current input value if there
    // were multiple host search XHR requests that didn't finish in the order they were called
    const docs = cachedSearches[currentInputValue.toLowerCase()] || [];

    let items = docs.map(user => {
      const { _id } = user;

      return {
        _id,
        value: formatHostName(user),
      };
    });

    if (items.length === 0) {
      items.push({
        _id: auth.doc._id,
        value: formatHostName(auth.doc) + ' (Me)',
      });
    }

    items.push({ _id: null, value: 'No Host' });

    items.push(ADD_NEW_HOST);

    return (
      <Downshift
        onChange={onSelect}
        initialInputValue={initialValue}
        itemToString={item => (item ? item.value : '')}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem,
        }) => (
          <div key="host-field" className="mb-1">
            <Input
              className=""
              label="Host"
              name="host"
              type="text"
              {...getInputProps({
                onChange: handleChange,
                onClick: handleInputClick,
                onBlur: handleBlur,
                onFocus: handleFocus,
              })}
              dirtyOverride={dirtyOverride(currentInputValue)}
              value={currentInputValue}
            />

            {hasFocus && !showAddHostModal ? (
              <div className="dropdown__list dropdown__list--host-list active">
                {items.map((item, index) => (
                  <div
                    key={index}
                    {...getItemProps({
                      key: index,
                      className: classnames(
                        'dropdown__item',
                        highlightedIndex === index && 'selected',
                        (item === ADD_NEW_HOST || item._id === null) &&
                          'dropdown__item--grey',
                      ),
                      item,
                    })}
                  >
                    {renderHostListItem(item, loading)}
                  </div>
                ))}
              </div>
            ) : null}

            {showAddHostModal ? (
              <Modal isOpen={true}>
                <div className="host-field__add-modal">
                  <h3>Add New Host</h3>
                  <FormHostAdd
                    cancelCallback={handleFormHostAddCancel}
                    submitCallback={handleFormHostAddSubmit}
                  />
                </div>
              </Modal>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

function mapStateToProps({ auth, user }) {
  return {
    auth,
    user,
  };
}

export default connect(
  mapStateToProps,
  {
    userAlertClose,
    userClear,
    userSearchHosts,
  },
)(DropdownHost);
