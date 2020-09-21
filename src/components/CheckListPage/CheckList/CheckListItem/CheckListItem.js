import React, { Component } from 'react';
import style from './CheckListItem.module.css';
// import Modal from '../../../ModalBackDrop/ModalBackDrop';
import CastomHabit from '../../../CustomHabit/CastomHabit';
import addHabitStatus from '../../../../redux/operations/chekListOperation';

import { ReactComponent as ButtonOk } from '../../../../assests/images/CheckListPage/button_ok.svg';
import { ReactComponent as ButtonDelete } from '../../../../assests/images/CheckListPage/button_delete.svg';
import { ReactComponent as ButtonEdit } from '../../../../assests/images/CheckListPage/button_edit.svg';

import {
  main_green,
  main_violet,
  main_pink,
  main_yellow,
  main_blue,
  green_1,
  // green_2,
  // main_gradient,
  // orange_gradient,
  // pink_gradient,
  // violet_gradient,
} from '../../../../css/vars.module.css';
import { connect } from 'react-redux';

class CheckListItem extends Component {
  state = {
    showFullInfo: false,
    isShowModal: false,
    fromCheckList: true,
    daysProgress: [],
    daysDone: '',
    daysPassed: '',
    habitChecked: false,
    checkedStatus: '',
    habitId: '',
    color: [
      main_violet,
      main_pink,
      main_green,
      main_yellow,
      main_blue,
      green_1,
    ],
  };

  componentDidMount() {
    this.setState({
      daysProgress: [...this.props.habit.data],
    });
  }

  //=========================== Color ==========================//

  // getRandomColor = () => {
  //   const color = Math.floor(Math.random() * 16777215).toString(16);
  //   if ((color !== '000000' || color !== 'ffffff') && color.length === 6) {
  //     return `#${color}`;
  //   } else return `${main_yellow}`;
  // };

  getColor = () => {
    const { color } = this.state;
    const { index } = this.props;

    let newColor;

    if (index < color.length) {
      newColor = color[index];
    }
    if (index >= color.length) {
      newColor = color[index - color.length];
    }
    return newColor;
  };

  //=========================== Modal ==========================//

  openModal = () => {
    this.setState({
      isShowModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      isShowModal: false,
    });
  };

  //=========================== OnClick ==========================//

  onStatus = bool => {
    this.setState(prev => ({
      showFullInfo: !prev.showFullInfo,
      habitId: this.props.habit._id,
      habitChecked: true,
    }));

    if (bool) {
      this.setState({
        checkedStatus: true,
      });
    } else {
      this.setState({
        checkedStatus: false,
      });
    }

    console.log('this.props', this.props);
    const { arrayDate } = this.props.habit;
    const date = new Date();
    const currentMonth =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const currentDay = `${date.getDate()}.${currentMonth}.${date.getFullYear()}`;
    console.log('currentDay', currentDay);

    const pushArray = [];

    if (arrayDate.includes(currentDay)) {
      arrayDate.map((date, idx) => {
        console.log('date', date);
        if (date === currentDay) {
          console.log('idx', idx);
          pushArray.push(idx);
        }
      });

      console.log('pushArray', pushArray);

      let isFirst = true;

      const firstNull = this.state.daysProgress.map(elem => {
        if (elem === null && isFirst) {
          isFirst = false;
          return bool;
        }
        return elem;
      });

      this.setState({
        daysDone: firstNull.filter(elem => elem === true).length,
        daysPassed: firstNull.filter(elem => elem === false).length,
      });
      const updateInfo = { id: this.props.habit._id, data: [...firstNull] };
      this.props.addStatus(updateInfo);
    }
  };

  render() {
    const { name, efficiency } = this.props.habit;
    const {
      isShowModal,
      daysDone,
      daysPassed,
      habitChecked,
      checkedStatus,
    } = this.state;
    // const color = this.getRandomColor();

    return (
      <div
        data-element="habit"
        style={{
          borderLeft: `8px solid ${this.getColor()}`,
        }}
        className={style.checkListItem}
      >
        <div className={style.checkListItemContentMainWrapper}>
          <div className={style.checkListItemContentWrapper}>
            <div className={style.checkListItemContent}>
              <label className={style.checkListItemProgressLabel}>
                <span>{name}</span>
                <progress
                  className={style.checkListItemProgress}
                  id="file"
                  max="100"
                  value={efficiency}
                >
                  70%
                </progress>
              </label>
              <p className={style.checkListItemProgressValue}>{efficiency}%</p>
            </div>
            <p className={style.checkListItemProgressComment}>
              Прогресс привития привычки
            </p>
          </div>
          <div className={style.checkListButtons}>
            <button
              disabled={habitChecked}
              // data-element="button"
              // data-status="true"
              className={
                checkedStatus
                  ? [
                      style.checkListButton,
                      style.checkListButtonSubmitDisabled,
                      style.checkListButtonSubmitDisabledActive,
                    ].join(' ')
                  : checkedStatus === false
                  ? [
                      style.checkListButton,
                      style.checkListButtonSubmitDisabledNoHover,
                    ].join(' ')
                  : [style.checkListButton, style.checkListButtonSubmit].join(
                      ' ',
                    )
              }
              type="button"
              onClick={() => this.onStatus(true)}
            >
              <ButtonOk data-element="svg" />
            </button>
            <button
              disabled={habitChecked && checkedStatus}
              // data-element="button"
              // data-status="false"
              className={
                checkedStatus === false
                  ? [
                      style.checkListButton,
                      style.checkListButtonDeleteDisabled,
                      style.checkListButtonDeleteDisabledActive,
                    ].join(' ')
                  : checkedStatus
                  ? [
                      style.checkListButton,
                      style.checkListButtonDeleteDisabledNoHover,
                    ].join(' ')
                  : [style.checkListButton, style.checkListButtonDelete].join(
                      ' ',
                    )
              }
              type="button"
              onClick={() => this.onStatus(false)}
            >
              <ButtonDelete data-element="svg" />
            </button>
            <button
              data-element="button_edit"
              className={style.checkListButtonEdit}
              type="button"
              onClick={this.openModal}
            >
              <ButtonEdit />
            </button>
            {isShowModal && (
              <CastomHabit
                close={this.closeModal}
                habit={this.props.habit}
                fromCheckList={this.state.fromCheckList}
              />
            )}
          </div>
        </div>
        {this.state.showFullInfo ? (
          <ul className={style.progressDaysContentList}>
            <li className={style.progressDaysContentItem}>
              <p className={style.progressDaysTitle}>К-во выполненных дней</p>
              <p className={style.fulfiledDays}>{daysDone}</p>
            </li>
            <li>
              <p className={style.progressDaysTitle}>К-во пропущенных дней</p>
              <p className={style.missedDays}>{daysPassed}</p>
            </li>
          </ul>
        ) : (
          ''
        )}
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   // console.log('state', state);
//   return {
//     stateHabits: state.habits.allHabits,
//   };
// };

const mapDispatchToProps = dispatch => {
  return {
    addStatus: updateInfo => dispatch(addHabitStatus(updateInfo)),
  };
};

export default connect(null, mapDispatchToProps)(CheckListItem);
