import React, { Component } from 'react';
import classnames from 'classnames';
import Editor from 'draft-js-plugins-editor';
import { EditorState, RichUtils } from 'draft-js';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];

export const ICON_SET = {
  search: <i className="icon fas fa-search" />,
  user: <i className="icon fas fa-user" />,
};

export const RichTextAreaError = props => {
  const { children } = props;
  return <div className="richtextarea__error">{children}</div>;
};

export const RichTextAreaLabel = props => {
  const {
    active,
    children,
    dirty,
    error,
    initial,
    touched,
    dirtyOverride,
  } = props;

  return (
    <div
      className={classnames(
        'input__label',
        (active || initial) && 'active',
        (dirty || dirtyOverride) && 'dirty',
        touched && error && 'error',
      )}
    >
      {children}
    </div>
  );
};

class RichTextArea extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
    this.focus = () => {
      this.editor.focus();
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command, editorState) {
    // Allows for keyboard shortcuts for bold and italic text
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    const { props } = this;

    const {
      autoFocus,
      className,
      icon,
      inline,
      input,
      label,
      meta,
      type,
      dirtyOverride = false,
      ...other
    } = props;
    const { error, touched } = meta;

    return (
      <div
        className={classnames('form-group', className, {
          'form-group--inline': inline,
        })}
      >
        <div className="editor-container" onClick={this.focus}>
          <Toolbar className="toolbar" />
          <Editor
            {...input}
            {...other}
            editorState={this.state.editorState}
            onChange={this.onChange}
            autoFocus={autoFocus}
            handleKeyCommand={this.handleKeyCommand}
            plugins={plugins}
            ref={element => {
              this.editor = element;
            }}
            className={classnames('richtextarea', touched && error && 'error')}
            type={type}
            onBlur={() => input.onBlur()}
          />

          {label && (
            <RichTextAreaLabel {...meta} dirtyOverride={dirtyOverride}>
              {label}
            </RichTextAreaLabel>
          )}
          {touched && error && <RichTextAreaError>{error}</RichTextAreaError>}
          {icon && ICON_SET[icon]}
        </div>
      </div>
    );
  }
}

export default RichTextArea;