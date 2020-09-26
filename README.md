![Sequelize banner](https://github.com/NookaPavan/Sequelize-Integration/blob/master/sequelize.png)

# Installing

```
$ npm install --save sequelize

$ npm install --save pg pg-hstore
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious
```

## Defining Model

```
const User = sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
});
```

## Getters/Setters

```
username: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue(username);
      return rawValue ? rawValue.toUpperCase() : null;
    }
}
password: {
    type: DataTypes.STRING,
    set(value) {
      // Storing passwords in plaintext in the database is terrible.
      // Hashing the value with an appropriate cryptographic hash function is better.
      this.setDataValue('password', hash(value));
    }
  }
```

```
const User = sequelize.define('user', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING
}, {
  getterMethods: {
    fullName() {
      return this.firstName + ' ' + this.lastName;
    }
  },
  setterMethods: {
    fullName(value) {
      // Note: this is just for demonstration.
      // See: https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/
      const names = value.split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');
      this.setDataValue('firstName', firstName);
      this.setDataValue('lastName', lastName);
    }
  }
});
```

## Creating an instance

```
const jane = User.build({ name: "Jane" });
const kane = await User.create({ name: "Kane" });
console.log(jane instanceof User); // true
console.log(jane.name); // "Jane"
``` 

### Saving/Read/Update/Deleting 

```
await jane.save();
await jane.reload();
await jane.save();
await jane.destroy();
console.log('Jane was saved to the database!');
```

## Data Types


1. strings
- DataTypes.STRING             // VARCHAR(255)
- DataTypes.STRING(1234)       // VARCHAR(1234)
- DataTypes.STRING.BINARY      // VARCHAR BINARY
- DataTypes.TEXT               // TEXT
- DataTypes.TEXT('tiny')       // TINYTEXT
- DataTypes.CITEXT             // CITEXT          PostgreSQL and SQLite only.

2. boolean
- DataTypes.BOOLEAN            // TINYINT(1)

3. numbers
- DataTypes.INTEGER            // INTEGER
- DataTypes.BIGINT             // BIGINT
- DataTypes.BIGINT(11)         // BIGINT(11)
- DataTypes.FLOAT              // FLOAT
- DataTypes.FLOAT(11)          // FLOAT(11)
- DataTypes.FLOAT(11, 10)      // FLOAT(11,10)
- DataTypes.REAL               // REAL            PostgreSQL only.
- DataTypes.REAL(11)           // REAL(11)        PostgreSQL only.
- DataTypes.REAL(11, 12)       // REAL(11,12)     PostgreSQL only.
- DataTypes.DOUBLE             // DOUBLE
- DataTypes.DOUBLE(11)         // DOUBLE(11)
- DataTypes.DOUBLE(11, 10)     // DOUBLE(11,10)
- DataTypes.DECIMAL            // DECIMAL
- DataTypes.DECIMAL(10, 2)     // DECIMAL(10,2)

4. unsigned and zero-fill integers
- DataTypes.INTEGER.UNSIGNED
- DataTypes.INTEGER.ZEROFILL
- DataTypes.INTEGER.UNSIGNED.ZEROFILL

```
type: DataTypes.UUID,
defaultValue: Sequelize.UUIDV4 // Or Sequelize.UUIDV1
```

## COLUMN OPTION FOR SEQUELIZE MODEL

```
flag: { 
	type: DataTypes.BOOLEAN, 
	allowNull: false, 
	defaultValue: true ,
	primaryKey: true ,
	autoIncrement: true,
	*// You can specify a custom column name via the 'field' attribute:*
 	fieldWithUnderscores: { type: DataTypes.STRING, field: 'field_with_underscores' }
	*// Creating two objects with the same value will throw an error. The unique property can be either a
  	// boolean, or a string. If you provide the same string for multiple columns, they will form a
  	// composite unique key.*
  uniqueOne: { type: DataTypes.STRING,  unique: 'compositeIndex' },
  uniqueTwo: { type: DataTypes.INTEGER, unique: 'compositeIndex' },
  	*// It is possible to create foreign keys:*
	bar_id: {
		type: DataTypes.INTEGER,

		references: {
		  *// This is a reference to another model*
		  model: Bar,

		  *// This is the column name of the referenced model*
		  key: 'id',

		  *// With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable *type.
		  deferrable: Deferrable.INITIALLY_IMMEDIATE
		  *// Options:
		  // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
		  // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
		  // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction*
    	}
    }
    
},{
  timestamps: false
}
```

## ASSOCIATIONS:

```
//one-to-one
Foo.hasOne(Bar, { 
  onDelete: 'RESTRICT/CASCADE',
  onUpdate: 'RESTRICT/CASCADE'
});

Foo.hasOne(Bar, {  
  foreignKey: 'myFooId'
});
Bar.belongsTo(Foo);
```

```
//one-to-many
Team.hasMany(Player, { 
  foreignKey: 'clubId'
});
Player.belongsTo(Team);
```

```
//many-to-many
Movie.belongsToMany(Actor, { through: 'ActorMovies' , sourceKey: 'name', targetKey: 'title' });
```

## Validations & Constraints

```
sequelize.define('foo', {
  bar: {
    type: DataTypes.STRING,
    validate: {
      is: /^[a-z]+$/i,          // matches this RegExp
      is: ["^[a-z]+$",'i'],     // same as above, but constructing the RegExp from a string
      not: /^[a-z]+$/i,         // does not match this RegExp
      not: ["^[a-z]+$",'i'],    // same as above, but constructing the RegExp from a string
      isEmail: true,            // checks for email format (foo@bar.com)
      isUrl: true,              // checks for url format (http://foo.com)
      isIP: true,               // checks for IPv4 (129.89.23.1) or IPv6 format
      isIPv4: true,             // checks for IPv4 (129.89.23.1)
      isIPv6: true,             // checks for IPv6 format
      isAlpha: true,            // will only allow letters
      isAlphanumeric: true,     // will only allow alphanumeric characters, so "_abc" will fail
      isNumeric: true,          // will only allow numbers
      isInt: true,              // checks for valid integers
      isFloat: true,            // checks for valid floating point numbers
      isDecimal: true,          // checks for any numbers
      isLowercase: true,        // checks for lowercase
      isUppercase: true,        // checks for uppercase
      isNull: true,             // only allows null
      notEmpty: true,           // don't allow empty strings
      equals: 'specific value', // only allow a specific value
      contains: 'foo',          // force specific substrings
      notIn: [['foo', 'bar']],  // check the value is not one of these
      isIn: [['foo', 'bar']],   // check the value is one of these
      notContains: 'bar',       // don't allow specific substrings
      len: [2,10],              // only allow values with length between 2 and 10
      isUUID: 4,                // only allow uuids
      isDate: true,             // only allow date strings
      isAfter: "2011-11-05",    // only allow date strings after a specific date
      isBefore: "2011-11-05",   // only allow date strings before a specific date
      max: 23,                  // only allow values <= 23
      min: 23,                  // only allow values >= 23
      isCreditCard: true,       // check for valid credit card numbers
      notNull: {
        msg: 'Please enter your name'  // won't allow null and returns message
      }

      // Examples of custom validators:
      isEven(value) {
        if (parseInt(value) % 2 !== 0) {
          throw new Error('Only even values are allowed!');
        }
      }
      isGreaterThanOtherField(value) {
        if (parseInt(value) <= parseInt(this.otherField)) {
          throw new Error('Bar must be greater than otherField.');
        }
      },
      isIn: {
        args: [['en', 'zh']],
        msg: "Must be English or Chinese"
      }
    }
  }
});

```
