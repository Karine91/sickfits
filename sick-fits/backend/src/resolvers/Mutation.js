const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail.js');

const setTokenCookie = (ctx, token) => {
    ctx.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
};

const Mutations = {
    async createItem(parent, args, ctx, info) {
        //TODO: check if they are logged in
        const item = await ctx.db.mutation.createItem(
            {
                data: {
                    ...args,
                },
            },
            info
        );

        return item;
    },
    updateItem(parent, args, ctx, info) {
        const { id, ...updates } = args;
        return ctx.db.mutation.updateItem(
            {
                data: updates,
                where: {
                    id: id,
                },
            },
            info
        );
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        const item = await ctx.db.query.item({ where }, `{ id title}`);
        // TODO: Check if they own that item, or have the permissions
        return ctx.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10);
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                    password,
                    permissions: {
                        set: ['USER'],
                    },
                },
            },
            info
        );
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        setTokenCookie(ctx, token);
        return user;
    },
    async signin(parent, { email, password }, ctx, info) {
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
            throw new Error(`No such user found for email ${email}`);
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid password!');
        }

        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        setTokenCookie(ctx, token);
        return user;
    },
    signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return { message: 'Goodbye!' };
    },
    async requestReset(parent, args, ctx, info) {
        //1.Check if this is a real user
        const user = await ctx.db.query.user({ where: { email: args.email } });

        if (!user) {
            throw new Error(`NO such user found for email ${args.email}`);
        }
        //2. Set a reset token and expiry on that user
        const randomBytesPromisified = promisify(randomBytes);
        const resetToken = (await randomBytesPromisified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; //1 hour from now
        const res = await ctx.db.mutation.updateUser({
            where: { email: args.email },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });
        const mailRes = await transport.sendMail({
            from: 'karine@karine.com',
            to: user.email,
            subject: 'Your Password Reset Link',
            html: makeANiceEmail(
                `Your Password Reset Token is here! \n\n <a href="${
                    process.env.FRONTEND_URL
                }/reset?resetToken=${resetToken}">Click Here To Reset</a>`
            ),
        });
        return { message: 'Thanks!' };
    },
    async resetPassword(parent, args, ctx, info) {
        if (args.password !== args.confirmPassword) {
            throw new Error("Yo Passwords don't match!");
        }

        const [user] = await ctx.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now(),
            },
        });

        if (!user) {
            throw new Error('This token is either invalid or expired');
        }
        const password = await bcrypt.hash(args.password, 10);
        const updatedUser = await ctx.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: 0,
            },
        });
        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        setTokenCookie(ctx, token);
        return updatedUser;
    },
};

module.exports = Mutations;
