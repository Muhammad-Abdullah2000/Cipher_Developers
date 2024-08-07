import React, { useState } from 'react';
import './App.css';
import { CiSearch } from 'react-icons/ci';
import { AiOutlinePercentage } from 'react-icons/ai';

export default function TaskForm() {

    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        applyToAll: false,
        applyToSpecific: false,
        categories: {
            bracelets: {
                jasmineBracelet: false,
                jesinthBracelet: false,
                inspireBracelet: false,
            },
            joinsItems: {
                zeroAmountsWithQuestions: false,
                normalItemsWithQuestions: false,
                normalItems: false,
            },
        },
        selectBracelets: false,
        selectJoins: false,
        textInput: '',
        percentageInput: ''
    });


    const handleChange = (event) => {
        const { name, checked, type, value } = event.target;

        if (type === 'checkbox') {
            if (name === 'applyToAll') {
                setFormData({
                    ...formData,
                    applyToAll: checked,
                    applyToSpecific: !checked ? formData.applyToSpecific : false,
                    categories: {
                        bracelets: {
                            jasmineBracelet: checked,
                            jesinthBracelet: checked,
                            inspireBracelet: checked,
                        },
                        joinsItems: {
                            zeroAmountsWithQuestions: checked,
                            normalItemsWithQuestions: checked,
                            normalItems: checked,
                        },
                    },
                    selectBracelets: checked,
                    selectJoins: checked
                });
                setError('');
            } else if (name === 'applyToSpecific') {
                setFormData({
                    ...formData,
                    applyToSpecific: checked,
                    applyToAll: !checked ? formData.applyToAll : false,
                    categories: !checked ? {
                        bracelets: {
                            jasmineBracelet: false,
                            jesinthBracelet: false,
                            inspireBracelet: false,
                        },
                        joinsItems: {
                            zeroAmountsWithQuestions: false,
                            normalItemsWithQuestions: false,
                            normalItems: false,
                        },
                    } : formData.categories,
                });
                setError('');
            } else if (name === 'selectBracelets') {
                setFormData({
                    ...formData,
                    applyToSpecific: checked,
                    selectBracelets: checked,
                    categories: {
                        ...formData.categories,
                        bracelets: {
                            jasmineBracelet: checked,
                            jesinthBracelet: checked,
                            inspireBracelet: checked,
                        },
                    },
                });
            } else if (name === 'selectJoins') {
                setFormData({
                    ...formData,
                    applyToSpecific: checked,
                    selectJoins: checked,
                    categories: {
                        ...formData.categories,
                        joinsItems: {
                            zeroAmountsWithQuestions: checked,
                            normalItemsWithQuestions: checked,
                            normalItems: checked,
                        },
                    },
                });
            } else if (name.startsWith('jasmineBracelet') || name.startsWith('jesinthBracelet') || name.startsWith('inspireBracelet')) {
                setFormData({
                    ...formData,
                    categories: {
                        ...formData.categories,
                        bracelets: {
                            ...formData.categories.bracelets,
                            [name]: checked,
                        },
                    },
                });
            } else if (name.startsWith('zeroAmountsWithQuestions') || name.startsWith('normalItemsWithQuestions') || name.startsWith('normalItems')) {
                setFormData({
                    ...formData,
                    categories: {
                        ...formData.categories,
                        joinsItems: {
                            ...formData.categories.joinsItems,
                            [name]: checked,
                        },
                    },
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const getButtonText = () => {
        if (formData) {
            const selectedBracelets = Object.values(formData.categories.bracelets).filter(value => value).length;
            const selectedJoins = Object.values(formData.categories.joinsItems).filter(value => value).length;
            const totalSelected = selectedBracelets + selectedJoins;

            return totalSelected > 0 ? `${totalSelected} item` : '';
        }
        return 'Submit';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.applyToAll) {

            const dataToSend = {

                textInput: formData.textInput,
                percentageData: formData.percentageInput ? parseFloat(formData.percentageInput) / 100 : 0,
                selectedCheckboxes: {
                    applyToAll: 'Apply to all items',
                    bracelets: ['Jasinthe Bracelet', 'Jesinth Bracelet', 'Inspire Bracelet'],
                    joinsItems: ['Zero Amounts with questions', 'Normal Items with questions', 'Normal Items']

                }
            };

            try {

                const response = await fetch('http://localhost:5000/api/data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });

                const result = await response.json();
                console.log('Form Data Submitted:', result);


                const fetchResponse = await fetch('http://localhost:5000/api/data');
                const fetchData = await fetchResponse.json();
                console.log('Data from server:', fetchData);

                setError('');

            } catch (error) {

                console.error('Error:', error);
                setError('An error occurred while submitting the form.');

            }

        } else if (!formData.applyToSpecific) {

            const hasSelectedCategories = Object.values(formData.categories.bracelets).includes(true) || Object.values(formData.categories.joinsItems).includes(true);

            if (hasSelectedCategories) {
                setError("Apply to specific items");
                return;
            };

        } else {

            const selectedBracelets = Object.entries(formData.categories.bracelets)
                .filter(([key, value]) => value)
                .map(([key]) => key.replace(/([a-z])([A-Z])/g, '$1 $2'));

            const selectedJoins = Object.entries(formData.categories.joinsItems)
                .filter(([key, value]) => value)
                .map(([key]) => key.replace(/([a-z])([A-Z])/g, '$1 $2'));

            const selectedCheckboxes = {
                applyToAll: formData.applyToAll ? 'Apply to all items' : null,
                applyToSpecific: formData.applyToSpecific ? 'Apply to specific items' : null,
                bracelets: selectedBracelets,
                joinsItems: selectedJoins
            };

            const dataToSend = {
                textInput: formData.textInput,
                percentageData: formData.percentageInput ? parseFloat(formData.percentageInput) / 100 : 0,
                selectedCheckboxes
            };

            try {

                const response = await fetch('http://localhost:5000/api/data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });
                const result = await response.json();
                console.log('Form Data Submitted:', result);

                const fetchResponse = await fetch('http://localhost:5000/api/data');
                const fetchData = await fetchResponse.json();
                console.log('Data from server:', fetchData);

                setError('');
            } catch (error) {
                console.error('Error:', error);
                setError('An error occurred');
            }

        }

        alert("Data is Submitted");

        window.location.reload();
    };

    return (
        <section className="main">
            <div className="container">
                <div className="task">
                    <h1>Add Tax</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="percentage">
                        <input type="text" id='text' name='textInput' value={formData.textInput} onChange={handleChange} />
                        <input
                            type="number"
                            id='percent'
                            name='percentageInput'
                            value={formData.percentageInput}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="select">
                        <label className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="applyToAll"
                                checked={formData.applyToAll}
                                onChange={handleChange}
                            />
                            <span className="checkbox-indicator"></span>
                            Apply to all items in collection
                        </label>
                        <label className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="applyToSpecific"
                                checked={formData.applyToSpecific}
                                onChange={handleChange}
                            />
                            <span className="checkbox-indicator"></span>
                            Apply to specific items
                        </label>
                    </div>

                    <hr />

                    <div className="items">
                        <div className="search">
                            <CiSearch id='se' />
                            <input type="text" placeholder='Search Items' />
                        </div>

                        <div className="itemsContent">
                            {formData && (
                                <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <div style={{ width: "100%", backgroundColor: "#DFDFDF", height: "5vh", display: "flex", alignItems: "center" }}>
                                        <label style={{ marginLeft: "10px" }}>
                                            <input
                                                type="checkbox"
                                                name="selectBracelets"
                                                checked={formData.selectBracelets}
                                                onChange={handleChange}
                                            />
                                            <span className="checkbox-indicator"></span>
                                            <strong>Bracelets</strong>
                                        </label>
                                    </div>
                                    <br />
                                    <label className="custom-checkbox-one">
                                        <input
                                            type="checkbox"
                                            name="jasmineBracelet"
                                            checked={formData.categories.bracelets.jasmineBracelet}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-indicator"></span>
                                        Jasinthe Bracelet
                                    </label>
                                    <label className="custom-checkbox-one">
                                        <input
                                            type="checkbox"
                                            name="jesinthBracelet"
                                            checked={formData.categories.bracelets.jesinthBracelet}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-indicator"></span>
                                        Jesinthe Bracelet
                                    </label>
                                    <label className="custom-checkbox-one">
                                        <input
                                            type="checkbox"
                                            name="inspireBracelet"
                                            checked={formData.categories.bracelets.inspireBracelet}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-indicator"></span>
                                        Inspire Bracelet
                                    </label>
                                    <br />
                                    <br />
                                    <div style={{ width: "100%", backgroundColor: "#DFDFDF", height: "5vh", display: "flex", alignItems: "center" }}>
                                        <label style={{ marginLeft: "10px" }}>
                                            <input
                                                type="checkbox"
                                                name="selectJoins"
                                                checked={formData.selectJoins}
                                                onChange={handleChange}
                                            />
                                            <span className="checkbox-indicator"></span>
                                        </label>
                                    </div>
                                    <br />
                                    <label className="custom-checkbox-one">
                                        <input
                                            type="checkbox"
                                            name="zeroAmountsWithQuestions"
                                            checked={formData.categories.joinsItems.zeroAmountsWithQuestions}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-indicator"></span>
                                        Zero amount item with questions
                                    </label>

                                    <label className="custom-checkbox-one">
                                        <input
                                            type="checkbox"
                                            name="normalItemsWithQuestions"
                                            checked={formData.categories.joinsItems.normalItemsWithQuestions}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-indicator"></span>
                                        Normal Item with questions
                                    </label>

                                    <label className="custom-checkbox-one">
                                        <input
                                            type="checkbox"
                                            name="normalItems"
                                            checked={formData.categories.joinsItems.normalItems}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-indicator"></span>
                                        normal item
                                    </label>
                                </div>
                            )}
                        </div>
                        <br />
                        <hr />
                        <div className='btn'>
                            <button type="submit">Apply Tax {getButtonText()}</button>
                            {error && <p className="error">{error}</p>}
                        </div>
                    </div>

                </form>

            </div>
        </section>
    );
}
