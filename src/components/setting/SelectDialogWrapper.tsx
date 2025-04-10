import * as React from 'react';
import { View } from 'react-native';

import Dialog from '../dialogs/GenericSelectDialog';
import { SelectSettingEntry } from './helpers/SettingEntry';
import { styles } from '@components/style';

export interface SelectDialogChildren<T> {
  setCurrentSelectOption: React.Dispatch<
    React.SetStateAction<SelectSettingEntry<T> | undefined>
  >;
  setSelectVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props<T> {
  Children: (p: SelectDialogChildren<T>) => React.JSX.Element;
}
export default function SelectDialog<T>({ Children }: Props<T>) {
  const [currentSelectOption, setCurrentSelectOption] =
    React.useState<SelectSettingEntry<T>>();
  const [selectVisible, setSelectVisible] = React.useState(false);

  return (
    <View style={styles.flex}>
      <Children
        setCurrentSelectOption={setCurrentSelectOption}
        setSelectVisible={setSelectVisible}
      />
      <Dialog
        visible={selectVisible}
        options={currentSelectOption?.options}
        renderOptionTitle={currentSelectOption?.renderOption}
        title={currentSelectOption?.title}
        defaultIndex={currentSelectOption?.defaultIndex}
        onClose={currentSelectOption?.onClose}
        onSubmit={currentSelectOption?.onSubmit}
      />
    </View>
  );
}
