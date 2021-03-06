
import React from 'react'
import {Map} from 'immutable'

const db = require('../../db')
const path = require('path')
const {remote} = require('electron')
const {Menu, MenuItem} = remote
const editorMenu = new Menu()
const previewMenu = new Menu()

class Editor extends React.Component {
	constructor(props) {
		super(props)
	}
	componentWillMount() {}
	componentDidMount() {
		const {iframe} = this.refs;
		iframe.contentWindow.handelContextmenu = this.contextMenu.bind(this)
		iframe.contentWindow.handelPreviewContextmenu = this.previewContextmenu.bind(this)
	}
	componentWillReceiveProps(newProps) {}
	shouldComponentUpdate(newProps, newState, newContext) {
		return !this.props.src===newProps.src
	}
	componentWillUpdate(newProps, newState, newContext) {}
	componentDidUpdate(oldProps, oldState, oldContext) {}
	componentWillUnmount() {}
	static defaultProps = {}
    state = {}
    static propTypes = {}
	render() {
		const {...props} = this.props
		return (
			<iframe ref="iframe" {...props}></iframe>
		)
	}

	previewContextmenu(e) {
		const {iframe} = this.refs;
		const win = iframe.contentWindow
		const editor = win.editor
		if(!editor || !editor._themes) {
			return;
		}
		if(previewMenu.items.length==0) {
			previewMenu.append(new MenuItem({
				label: '实时预览', 
				click: function (menuItem, browserWindow, event) { 
					editor.closePreview = !editor.closePreview
				}.bind(this),
				type: 'checkbox',
				checked: !editor.closePreview
			}))
		}
		e.stopPropagation()
		e.preventDefault()
		previewMenu.popup(remote.getCurrentWindow())
	}
	contextMenu(e) {

		const {iframe} = this.refs;
		const win = iframe.contentWindow
		const editor = win.editor
		if(!editor || !editor._themes) {
			return;
		}
		if(editorMenu.items.length==0) {
			editor._themes.forEach(fulltheme=>{
				editorMenu.append(new MenuItem({
					label: path.basename(fulltheme), 
					click: function (menuItem, browserWindow, event) { 
						editor.setTheme(fulltheme)
						db.set('editor_theme', fulltheme)
					}.bind(this),
					type: 'radio',
					checked: editor.getTheme()===fulltheme
				}));
			})
		}
		e.stopPropagation()
		e.preventDefault()
		editorMenu.popup(remote.getCurrentWindow())
	}
}

export default Editor;
