import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {
	
	constructor() {
		super();

		this.state = {
			todoData: [
				this.createTodoItem('Drink coffee', 1),
				this.createTodoItem('Made Awesom App', 2),
				this.createTodoItem('Have a lunch', 3)
			],
			filterText: '',
			filter: 'all' // active, all, done
		};
	};

	createTodoItem(label, id) {
		return {
			label,
			id,
			important: false, 
			done: false
		}
	};

	deleteItem = (id) => {
		this.setState(({ todoData }) => {
			const idx = todoData.findIndex((el) => el.id===id);
			const newArray = [
				...todoData.slice(0, idx), 
				...todoData.slice(idx+1)];
			
			return {
				todoData: newArray
			};
		});
	};

	addItem = (text) => {
		const getNextId = (inArr) => {
			const idArr = inArr.map(obj => obj.id);
			const nextId = Math.max(...idArr) + 1;
			return nextId;
		};
		
		this.setState(({ todoData }) => {
			const nextId = getNextId(todoData);
			
			const newItem = this.createTodoItem(text, nextId)
			// const newItem = {label: text, important: false, id: nextId}

			const newArray = [...todoData, newItem];

			return {
				todoData: newArray
			};
		});

	};

	toggleProperty = (arr, id, propName) => {
		const idx = arr.findIndex((el) => el.id===id);
		const oldItem = arr[idx];
		const newItem = {...oldItem, [propName]: !oldItem[propName]};
		return [
			...arr.slice(0, idx), 
			newItem,
			...arr.slice(idx+1)];
	};

	onToggleImportant = (id) => {
		this.setState(( {todoData} ) => {
			return {
				todoData: this.toggleProperty(todoData, id, 'important')
			};
		});
	};

	onToggleDone = (id) => {
		this.setState(( {todoData} ) => {
			
			return {
				todoData: this.toggleProperty(todoData, id, 'done')
			};
		});

	};

	onFilterList = (filterText) => {
		this.setState( {filterText} );
	};

	onSwithFilter = (filter) => {
		this.setState( {filter} );
	};

	search(items, filterText) {
		if (filterText.length === 0) {
			return items
		};

		return items.filter((item) => {
			return item.label.toUpperCase()
				.indexOf(filterText.toUpperCase()) > -1;
		});
	};

	filter(items, filter) {
		switch(filter) {
			case 'all':
				return items;
			case 'active':
				return items.filter((item) => !item.done);
			case 'done':
				return items.filter((item) => item.done);
			default:
				return items;
		}
	};

	


	render() {
		const { todoData, filterText, filter } = this.state;
		const doneCount = todoData.filter((el) => el.done).length;
		const doDoCount = todoData.length - doneCount;

		const visibleItems = this.filter(
			this.search(todoData, filterText), filter);

		return (
			<div className="todo-app">
				<AppHeader toDo={doDoCount} done={doneCount} />
				<div className="top-panel d-flex">
					<SearchPanel onFilterList={this.onFilterList} />
					<ItemStatusFilter onSwithFilter={this.onSwithFilter} filter={filter} />
				</div>

				<TodoList 
				  todos={visibleItems} 
				  onDeleted={ this.deleteItem }
				  onToggleImportant={this.onToggleImportant} 
				  onToggleDone={this.onToggleDone} />
				
				<ItemAddForm onItemAdded={ this.addItem } />
			</div>
		);
	};
};