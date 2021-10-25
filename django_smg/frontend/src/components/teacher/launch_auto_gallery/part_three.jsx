import React, { useState } from "react";
import styled, {
  Description,
  Form,
  Input,
  Label,
  Button,
  FormErrorText,
} from "Styles";

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
`;

const GroupForm = ({
  id,
  value,
  onChange,
  onRemoveGroup,
  showErrors,
  errors,
}) => {
  return (
    <>
      <Label htmlFor={id}>Group Name</Label>
      {showErrors && errors[id].length > 0
        ? errors[id].map((e, i) => (
            <FormErrorText key={e + i} warn>
              {e}
            </FormErrorText>
          ))
        : null}
      <FlexRow>
        <Input
          placeholder="group name"
          type="text"
          id={id}
          value={value}
          onChange={onChange}
        />
        <Button color="salmon" type="button" onClick={() => onRemoveGroup(id)}>
          Remove
        </Button>
      </FlexRow>
    </>
  );
};

const FlexContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  background-color: #ddd;
  padding: 0.5rem;
  border-radius: 20px;
  box-shadow: 0px 1px 2px rgb(100, 100, 100);
`;

/**
 * Set song groups
 */
export const BreadCrumbThree = ({ onCrumbComplete }) => {
  const [groups, setGroups] = useState([
    { id: "default", name: "", errors: [] },
  ]);
  const [showErrors, setShowErrors] = useState(false);

  // validation
  const errorTypes = {
    empty: "group name cannot be empty",
    overflow: "group name cannot be greater than 100 characters long",
  };
  const validationErrors = {};
  groups.forEach((g) => {
    if (validationErrors[g.id] === undefined) {
      validationErrors[g.id] = [];
    }
    if (
      g.name.length === 0 &&
      !validationErrors[g.id].includes(errorTypes.empty)
    ) {
      validationErrors[g.id].push(errorTypes.empty);
    }
    if (
      g.name.length > 100 &&
      !validationErrors[g.id].includes(errorTypes.overflow)
    ) {
      validationErrors[g.id].push(errorTypes.overflow);
    }
  });

  const submitHandler = (e) => {
    e.preventDefault();
    const errsPresent = Object.values(validationErrors).reduce((acc, v) => {
      if (v.length) {
        return true;
      }
      return acc;
    }, false);
    if (errsPresent) {
      setShowErrors(true);
      return;
    }
    onCrumbComplete({
      group_names: groups.map((g) => g.name),
    });
  };
  const addGroup = () => {
    const newGroups = [...groups];
    newGroups.push({
      id: Math.random().toString(),
      name: "",
      errors: [],
    });
    setGroups([...newGroups]);
  };

  const updateGroup = (id, newName) => {
    const newGroups = [...groups];
    newGroups.forEach((g) => {
      if (g.id === id) {
        g.name = newName;
      }
    });
    setGroups([...newGroups]);
  };

  const removeGroup = (id) => {
    const newGroups = groups.filter((g) => g.id !== id);
    setGroups([...newGroups]);
  };

  return (
    <Form onSubmit={submitHandler}>
      <Description>
        {groups.map((g) => (
          <GroupForm
            id={g.id}
            value={g.name}
            onChange={(e) => updateGroup(g.id, e.target.value)}
            onRemoveGroup={removeGroup}
            showErrors={showErrors}
            errors={validationErrors}
            key={g.id}
          />
        ))}
        <div>
          <FlexContainer>
            <Button type="button" onClick={addGroup}>
              Add Group
            </Button>
            <Button>Submit</Button>
          </FlexContainer>
        </div>
      </Description>
    </Form>
  );
};
