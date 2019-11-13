<template>
    <div></div>
</template>

<script>
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'

    const AuthRepository = RepositoryFactory.get('auth');
    export default {
        created() {
            this.verify();
        },
        methods: {
            async verify() {
                let token = this.$route.query.token;
                try {
                    var res = await AuthRepository.verify(token);
                    if (res.status === 200) {
                        localStorage.setItem('token', token);
                        this.$router.push({name: "resetpassword"});
                    }
                } catch (e) {
                    this.$router.push({
                        name: "forgotpassword",
                        query: {isError: true}
                    });
                }
            }
        }
    };
</script>
