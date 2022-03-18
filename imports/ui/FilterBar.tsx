import { EuiButton, EuiFieldText } from '@elastic/eui';
import React, { useMemo } from 'react';
import _ from 'underscore';

const FilterComponent = ({ filterText, onFilter, onClear }: any) => {
    return (
        <>
            <EuiFieldText 
                placeholder='Filter'
                value={filterText}
                onChange={onFilter}
                append={ 
                    <EuiButton color='text' onClick={onClear}>Clear</EuiButton>
                }
            />
        </>
    )
}

export default function FilterBar({dataToFilter}: any) {
    const [filterText, setFilterText] = React.useState('');
    const flattenedData = _.flatten(dataToFilter);
    const filteredItems = flattenedData.filter(
		item => item.includes(filterText.toLowerCase()),
	);

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
			if (filterText) {
				setFilterText('');
			}
		};
        return (
            <FilterComponent onFilter={(e: any) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText}/>
        )
    }, [filterText]);

    return (
        <>
            { subHeaderComponentMemo }
        </>
    )
}